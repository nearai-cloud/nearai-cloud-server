import { createRouteResolver } from '../../middlewares/route-resolver';
import { keyAuthMiddleware } from '../../middlewares/auth';
import * as v from 'valibot';
import * as ctx from 'express-http-context';
import { litellmDatabaseClient } from '../../../services/litellm-database-client';
import { createOpenAiHttpError } from '../../../utils/error';
import { STATUS_CODES } from '../../../utils/consts';
import { createPrivateLlmApiClient } from '../../../services/private-llm-api-client';
import { InternalModelParams } from '../../../types/litellm-database-client';
import { nearAiCloudDatabaseClient } from '../../../services/nearai-cloud-database-client';
import { logger } from '../../../services/logger';
import { Signature } from '../../../types/privatellm-api-client';

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
  resolve: async ({ inputs: { params, query } }) => {
    const modelParamsList: InternalModelParams[] = ctx.get('modelParamsList');

    const cache = await nearAiCloudDatabaseClient.getSignatures(
      params.chat_id,
      query.signing_algo,
    );

    if (cache.length > 0) {
      return cache[0];
    }

    // In order to solve the problem of not being able to
    // synchronously query the actual model corresponding
    // to the chat, we iterate through calling the API of each model
    for (const [index, modelParams] of modelParamsList.reverse().entries()) {
      const client = createPrivateLlmApiClient(
        modelParams.apiKey,
        modelParams.apiUrl,
      );

      let signature: Signature;

      try {
        signature = await client.signature({
          chat_id: params.chat_id,
          model: modelParams.model,
          signing_algo: query.signing_algo,
        });
      } catch (e: unknown) {
        logger.debug(
          `Failed to get signature: ${e}. ${JSON.stringify(
            {
              modelId: modelParams.modelId,
              model: modelParams.model,
              number: index + 1,
              totalNumber: modelParamsList.length,
            },
            undefined,
            2,
          )}`,
        );

        continue;
      }

      nearAiCloudDatabaseClient
        .setSignature(
          modelParams.modelId,
          params.chat_id,
          modelParams.model,
          signature,
        )
        .catch((reason) => {
          logger.error(`Failed to set chat message signature: ${reason}`);
        });

      return signature;
    }

    throw createOpenAiHttpError({
      status: STATUS_CODES.NOT_FOUND,
      message: 'Chat id not found',
    });
  },
});
