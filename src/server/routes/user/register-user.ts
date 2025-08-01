import ctx from 'express-http-context';
import { lightLLM } from '../../../services/light-llm';
import { CTX_GLOBAL_KEYS } from '../../../utils/consts';
import { WeakAuth, weakAuth } from '../../middlewares/auth';
import { createRouteHandler } from '../../middlewares/parse';
import { RouteHandler } from '../../../types/parsers';

export const registerUser: RouteHandler = createRouteHandler({
  preHandle: [weakAuth],
  handle: async () => {
    const { authUser }: WeakAuth = ctx.get(CTX_GLOBAL_KEYS.WEAK_AUTH);

    await lightLLM.registerUser({
      userId: authUser.id,
      userEmail: authUser.email,
    });
  },
});
