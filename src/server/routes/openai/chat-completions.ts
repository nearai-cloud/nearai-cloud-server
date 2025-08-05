import ctx from 'express-http-context';
import { KeyAuth, keyAuthMiddleware } from '../../middlewares/auth';
import { CTX_GLOBAL_KEYS } from '../../../utils/consts';
import { throwHttpError } from '../../../utils/error';
import { LitellmClientError } from '../../../services/litellm';
import { createRouteResolver } from '../../middlewares/route-resolver';

export const chatCompletions = createRouteResolver({
  middlewares: [keyAuthMiddleware],
  resolve: async ({ req }) => {
    const { litellmClient }: KeyAuth = ctx.get(CTX_GLOBAL_KEYS.KEY_AUTH);

    try {
      return await litellmClient.chatCompletions(req.body);
    } catch (e: unknown) {
      if (e instanceof LitellmClientError) {
        throwHttpError({
          status: Number(e.code),
          cause: e,
        });
      }

      throw e;
    }
  },
});
