import ctx from 'express-http-context';
import { liteLLM } from '../../../services/lite-llm';
import { CTX_GLOBAL_KEYS } from '../../../utils/consts';
import { WeakAuth, weakAuthMiddleware } from '../../middlewares/auth';
import { createRouteResolver } from '../../middlewares/route-resolver';

export const registerUser = createRouteResolver({
  middlewares: [weakAuthMiddleware],
  resolve: async () => {
    const { authUser }: WeakAuth = ctx.get(CTX_GLOBAL_KEYS.WEAK_AUTH);

    await liteLLM.registerUser({
      userId: authUser.id,
      userEmail: authUser.email,
    });
  },
});
