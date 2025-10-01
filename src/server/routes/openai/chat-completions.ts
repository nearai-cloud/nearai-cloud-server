import { createHash } from 'crypto';
import ctx from 'express-http-context';
import { createLitellmApiClient } from '../../../services/litellm-api-client';
import {
  BEARER_TOKEN_PREFIX,
  CTX_GLOBAL_KEYS,
  STATUS_CODES,
} from '../../../utils/consts';
import { createOpenAiHttpError } from '../../../utils/error';
import { KeyAuth, keyAuthMiddleware } from '../../middlewares/auth';
import { createRouteResolver } from '../../middlewares/route-resolver';

export const chatCompletions = createRouteResolver({
  middlewares: [keyAuthMiddleware],
  resolve: async ({ req }) => {
    const { key }: KeyAuth = ctx.get(CTX_GLOBAL_KEYS.KEY_AUTH);

    // Check if this is a service account
    const isServiceAccount =
      !!key.metadata.service_account_id && key.userId === null;

    // Parse the request body
    const parsedBody = JSON.parse(req.body.toString());

    // If not a service account, check for forbidden fields
    if (!isServiceAccount) {
      const forbiddenFields = ['user', 'litellm_metadata', 'metadata'];
      const foundForbiddenFields = forbiddenFields.filter(
        (field) => field in parsedBody,
      );

      if (foundForbiddenFields.length > 0) {
        throw createOpenAiHttpError({
          status: STATUS_CODES.FORBIDDEN,
          message: 'Request not allowed for non-service account',
        });
      }
    }

    const litellmApiClient = createLitellmApiClient(
      req.headers.authorization?.slice(BEARER_TOKEN_PREFIX.length) ?? '',
    );

    const xRequestHash = createHash('sha256')
      .update(req.body)
      .digest()
      .toString('hex');

    return litellmApiClient.chatCompletions({
      ...parsedBody,
      extra_headers: {
        'X-Request-Hash': xRequestHash,
      },
    });
  },
});
