import { createRouteResolver } from '../../middlewares/route-resolver';
import { keyAuthMiddleware } from '../../middlewares/auth';
import * as v from 'valibot';
import { getInternalModelMetadata } from '../../../database/client';
import { throwHttpError } from '../../../utils/error';
import { STATUS_CODES } from '../../../utils/consts';
import { PrivatellmClient } from '../../../services/privatellm';

const inputSchema = v.object({
  model: v.string(),
});

export const attestationReport = createRouteResolver({
  inputs: {
    query: inputSchema,
  },
  middlewares: [keyAuthMiddleware],
  resolve: async ({ inputs: { query } }) => {
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

    return await client.attestationReport(metadata.model);
  },
});
