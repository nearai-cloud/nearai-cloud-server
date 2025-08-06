import { createRouteResolver } from '../../middlewares/route-resolver';
import { keyAuthMiddleware } from '../../middlewares/auth';
import * as v from 'valibot';
import { getInternalModelMetadata } from '../../../database/client';
import { throwHttpError } from '../../../utils/error';
import { STATUS_CODES } from '../../../utils/consts';
import { PrivatellmClient } from '../../../services/privatellm';

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
    const metadata = await getInternalModelMetadata(query.model);

    if (!metadata) {
      throwHttpError({
        status: STATUS_CODES.BAD_REQUEST,
        message: 'Invalid model',
      });
    }

    const client = new PrivatellmClient({
      apiUrl: metadata.apiUrl,
      apiKey: metadata.apiKey,
    });

    return client.signature(metadata.model, params.chat_id, query.signing_algo);
  },
});
