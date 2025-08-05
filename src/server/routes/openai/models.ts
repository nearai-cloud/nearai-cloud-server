import ctx from 'express-http-context';
import { KeyAuth, keyAuthMiddleware } from '../../middlewares/auth';
import { CTX_GLOBAL_KEYS } from '../../../utils/consts';
import { LitellmClientError } from '../../../services/litellm';
import { throwHttpError } from '../../../utils/error';
import { createRouteResolver } from '../../middlewares/route-resolver';

export const models = createRouteResolver({
  middlewares: [keyAuthMiddleware],
  resolve: async () => {
    const { litellmClient }: KeyAuth = ctx.get(CTX_GLOBAL_KEYS.KEY_AUTH);

    try {
      return await litellmClient.models();
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
