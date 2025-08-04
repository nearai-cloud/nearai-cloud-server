import ctx from 'express-http-context';
import { litellm } from '../../../services/litellm';
import { CTX_GLOBAL_KEYS } from '../../../utils/consts';
import { TokenAuth, tokenAuthMiddleware } from '../../middlewares/auth';
import { createRouteResolver } from '../../middlewares/route-resolver';

export const registerUser = createRouteResolver({
  middlewares: [tokenAuthMiddleware],
  resolve: async () => {
    const { authUser }: TokenAuth = ctx.get(CTX_GLOBAL_KEYS.PRE_AUTH);

    await litellm.registerUser({
      userId: authUser.id,
      userEmail: authUser.email,
    });
  },
});
