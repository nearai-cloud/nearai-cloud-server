import ctx from 'express-http-context';
import * as v from 'valibot';
import { lightLLM } from '../../../services/light-llm';
import { CTX_GLOBAL_KEYS } from '../../../utils/consts';
import { WeakAuth, weakAuth } from '../../middlewares/auth';
import { createRouteHandler } from '../../middlewares/parse';
import { RouteHandler } from '../../../types/parsers';

const outputSchema = v.nullable(
  v.object({
    userId: v.string(),
    userEmail: v.nullable(v.string()),
  }),
);

export const getUser: RouteHandler = createRouteHandler({
  outputSchema,
  preHandle: [weakAuth],
  handle: async () => {
    const { authUser }: WeakAuth = ctx.get(CTX_GLOBAL_KEYS.WEAK_AUTH);

    const user = await lightLLM.getUser(authUser.id);

    if (!user) {
      return null;
    }

    return {
      userId: user.userId,
      userEmail: user.userEmail,
    };
  },
});
