import { createRouteResolver } from '../../middlewares/route-resolver';
import { keyAuthMiddleware } from '../../middlewares/auth';
import * as v from 'valibot';
import { litellmDatabaseClient } from '../../../services/litellm-database-client';
import { throwHttpError } from '../../../utils/error';
import { STATUS_CODES } from '../../../utils/consts';
import { PrivatellmApiClient } from '../../../services/privatellm-api-client';

const paramsInputSchema = v.object({
  chat_id: v.string(),
});

const queryInputSchema = v.object({
  model: v.string(),
  signing_algo: v.string(),
});

export const signature = createRouteResolver({
  inputs: {
    params: paramsInputSchema,
    query: queryInputSchema,
  },
  middlewares: [keyAuthMiddleware],
  resolve: async ({ inputs: { params, query } }) => {
    const modelParams = await litellmDatabaseClient.getInternalModelParams(
      query.model,
    );

    if (!modelParams) {
      throwHttpError({
        status: STATUS_CODES.BAD_REQUEST,
        message: 'Unsupported model',
      });
    }

    const client = new PrivatellmApiClient({
      apiUrl: modelParams.apiUrl,
      apiKey: modelParams.apiKey,
    });

    return client.signature(
      modelParams.model,
      params.chat_id,
      query.signing_algo,
    );
  },
});
