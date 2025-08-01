import ctx from 'express-http-context';
import { lightLLM } from '../../../services/light-llm';
import { CTX_GLOBAL_KEYS } from '../../../utils/consts';
import { WeakAuth, weakAuthMiddleware } from '../../middlewares/auth';
import { createRouteHandlers } from '../../middlewares/route-handler';
import { RouteHandlers } from '../../../types/route-handler';

export const registerUser: RouteHandlers = createRouteHandlers({
  middlewares: [weakAuthMiddleware],
  handle: async () => {
    const { authUser }: WeakAuth = ctx.get(CTX_GLOBAL_KEYS.WEAK_AUTH);

    await lightLLM.registerUser({
      userId: authUser.id,
      userEmail: authUser.email,
    });
  },
});
