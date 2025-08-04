import ctx from 'express-http-context';
import * as v from 'valibot';
import { litellm } from '../../../services/litellm';
import { CTX_GLOBAL_KEYS } from '../../../utils/consts';
import { WeakAuth, weakAuthMiddleware } from '../../middlewares/auth';
import { createRouteResolver } from '../../middlewares/route-resolver';

const outputSchema = v.nullable(
  v.object({
    userId: v.string(),
    userEmail: v.nullable(v.string()),
  }),
);

export const getUser = createRouteResolver({
  output: outputSchema,
  middlewares: [weakAuthMiddleware],
  resolve: async () => {
    const { authUser }: WeakAuth = ctx.get(CTX_GLOBAL_KEYS.WEAK_AUTH);

    const user = await litellm.getUser(authUser.id);

    if (!user) {
      return null;
    }

    return {
      userId: user.userId,
      userEmail: user.userEmail,
    };
  },
});
