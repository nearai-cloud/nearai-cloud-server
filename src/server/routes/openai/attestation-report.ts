import { createRouteResolver } from '../../middlewares/route-resolver';
import { keyAuthMiddleware } from '../../middlewares/auth';
import * as v from 'valibot';
import { litellmDatabaseClient } from '../../../services/litellm-database-client';
import { throwHttpError } from '../../../utils/error';
import { STATUS_CODES } from '../../../utils/consts';
import { PrivatellmApiClient } from '../../../services/privatellm-api-client';

const inputSchema = v.object({
  model: v.string(),
});

export const attestationReport = createRouteResolver({
  inputs: {
    query: inputSchema,
  },
  middlewares: [keyAuthMiddleware],
  resolve: async ({ inputs: { query } }) => {
    const metadata = await litellmDatabaseClient.getInternalModelParams(
      query.model,
    );

    if (!metadata) {
      throwHttpError({
        status: STATUS_CODES.BAD_REQUEST,
        message: 'Invalid model',
      });
    }

    const client = new PrivatellmApiClient({
      apiUrl: metadata.apiUrl,
      apiKey: metadata.apiKey,
    });

    return await client.attestationReport(metadata.model);
  },
});
