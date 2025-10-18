import { createRouteResolver } from '../../middlewares/route-resolver';
import { keyAuthMiddleware } from '../../middlewares/auth';
import * as v from 'valibot';
import { litellmDatabaseClient } from '../../../services/litellm-database-client';
import { createOpenAiHttpError } from '../../../utils/error';
import {
  ATTESTATION_REPORT_TTL,
  FETCH_ATTESTATION_REPORT_TIMEOUT,
  STATUS_CODES,
} from '../../../utils/consts';
import { createPrivateLlmApiClient } from '../../../services/private-llm-api-client';
import * as ctx from 'express-http-context';
import { InternalModelParams } from '../../../types/litellm-database-client';
import { AttestationReport } from '../../../types/privatellm-api-client';
import { logger } from '../../../services/logger';
import { InMemoryCache } from '../../../utils/InMemoryCache';
import { getQuote } from '../../../utils/attestation';
import { DstackClient } from '@phala/dstack-sdk';
import { config } from '../../../config';

const cache = new InMemoryCache<AttestationReport>(ATTESTATION_REPORT_TTL);

const inputSchema = v.object({
  model: v.string(),
});

const gatewayAttestationSchema = v.object({
  quote: v.string(),
  event_log: v.string(),
});

const modelAttestationSchema = v.object({
  signing_address: v.string(),
  intel_quote: v.string(),
  nvidia_payload: v.string(),
});

const outputSchema = v.object({
  gateway_attestation: gatewayAttestationSchema,
  model_attestations: v.array(modelAttestationSchema),
});

export const attestationReport = createRouteResolver({
  inputs: {
    query: inputSchema,
  },
  output: outputSchema,
  middlewares: [
    keyAuthMiddleware,
    async (req, res, next, { query }) => {
      const modelAlias = await litellmDatabaseClient.getModelAlias();
      query.model = modelAlias[query.model] ?? query.model;

      const modelParamsList =
        await litellmDatabaseClient.listInternalModelParams(query.model);

      if (modelParamsList.length === 0) {
        throw createOpenAiHttpError({
          status: STATUS_CODES.BAD_REQUEST,
          message: 'Invalid model',
        });
      }

      ctx.set('modelParamsList', modelParamsList);

      next();
    },
  ],
  resolve: async ({ inputs: { query } }) => {
    const client = new DstackClient();
    // TODO: add nonce from the request to the report data
    const gatewayAttestation = !config.isDev
      ? await getQuote(client, new Date().toISOString())
      : {
          quote: 'quote not available for development environment',
          event_log: 'event log not available for development environment',
        };

    if (!gatewayAttestation) {
      throw createOpenAiHttpError({
        status: STATUS_CODES.INTERNAL_SERVER_ERROR,
        message: 'Failed to get gateway attestation',
      });
    }

    const report = cache.get(query.model);
    if (report) {
      return {
        gateway_attestation: gatewayAttestation,
        model_attestations: report.all_attestations,
      };
    }

    const modelParamsList: InternalModelParams[] = ctx.get('modelParamsList');

    const reportPromises = modelParamsList.map((modelParams) => {
      const client = createPrivateLlmApiClient(
        modelParams.apiKey,
        modelParams.apiUrl,
      );

      const f = async () => {
        try {
          return await client.attestationReport(
            {
              model: modelParams.model,
            },
            FETCH_ATTESTATION_REPORT_TIMEOUT,
          );
        } catch (e) {
          logger.debug(
            `Failed to GET /attestation/report. Model Id (${modelParams.modelId}). ${e}`,
          );
          return undefined;
        }
      };

      return f();
    });

    const reports = await Promise.all(reportPromises);

    let mergedReport: AttestationReport | undefined;

    // TODO: make sure all_attestations field of models are all included
    reports.forEach((report) => {
      if (!report) {
        return;
      }

      if (!mergedReport) {
        mergedReport = report;
      } else {
        if (report.all_attestations.length > 0) {
          mergedReport.all_attestations.push(...report.all_attestations);
        } else {
          mergedReport.all_attestations.push(report);
        }
      }
    });

    if (!mergedReport) {
      throw createOpenAiHttpError({
        status: STATUS_CODES.INTERNAL_SERVER_ERROR,
        message: 'No model attestations available',
      });
    }

    cache.set(query.model, mergedReport);

    return {
      gateway_attestation: gatewayAttestation,
      model_attestations: mergedReport.all_attestations,
    };
  },
});
