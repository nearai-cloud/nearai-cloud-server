import { createRouteResolver } from '../../middlewares/route-resolver';
import { keyAuthMiddleware } from '../../middlewares/auth';
import * as v from 'valibot';
import * as ctx from 'express-http-context';
import { litellmDatabaseClient } from '../../../services/litellm-database-client';
import { createOpenAiHttpError } from '../../../utils/error';
import { STATUS_CODES } from '../../../utils/consts';
import { createPrivatellmApiClient } from '../../../services/privatellm-api-client';
import { InternalModelParams } from '../../../types/litellm-database-client';

const paramsInputSchema = v.object({
  chat_id: v.string(),
});

const queryInputSchema = v.object({
  model: v.string(),
  signing_algo: v.union([v.literal('ecdsa'), v.literal('ed25519')]),
});

const outputSchema = v.object({
  text: v.string(),
  signature: v.string(),
  signing_address: v.string(),
  signing_algo: v.union([v.literal('ecdsa'), v.literal('ed25519')]),
});

export const signature = createRouteResolver({
  inputs: {
    params: paramsInputSchema,
    query: queryInputSchema,
  },
  output: outputSchema,
  middlewares: [
    keyAuthMiddleware,
    async (req, res, next, { query }) => {
      const modelParams = await litellmDatabaseClient.getInternalModelParams(
        query.model,
      );

      if (!modelParams) {
        throw createOpenAiHttpError({
          status: STATUS_CODES.BAD_REQUEST,
          message: 'Invalid model',
        });
      }

      ctx.set('modelParams', modelParams);

      next();
    },
  ],
  resolve: async ({ inputs: { params, query } }) => {
    const modelParams: InternalModelParams = ctx.get('modelParams');
    const client = createPrivatellmApiClient(
      modelParams.apiKey,
      modelParams.apiUrl,
    );
    return client.signature({
      chat_id: params.chat_id,
      model: modelParams.model,
      signing_algo: query.signing_algo,
    });
  },
});
