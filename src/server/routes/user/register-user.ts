import ctx from 'express-http-context';
import { lightLLM } from '../../../services/light-llm';
import { CTX_GLOBAL_KEYS } from '../../../utils/consts';
import { WeakAuth, weakAuthMiddleware } from '../../middlewares/auth';
import { createRouteResolver } from '../../middlewares/route-resolver';
import { RouteResolver } from '../../../types/route-resolver';

export const registerUser: RouteResolver = createRouteResolver({
  middlewares: [weakAuthMiddleware],
  resolve: async () => {
    const { authUser }: WeakAuth = ctx.get(CTX_GLOBAL_KEYS.WEAK_AUTH);

    await lightLLM.registerUser({
      userId: authUser.id,
      userEmail: authUser.email,
    });
  },
});
