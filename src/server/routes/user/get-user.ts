import ctx from 'express-http-context';
import * as v from 'valibot';
import { litellm } from '../../../services/litellm';
import { CTX_GLOBAL_KEYS } from '../../../utils/consts';
import { PreAuth, preAuthMiddleware } from '../../middlewares/auth';
import { createRouteResolver } from '../../middlewares/route-resolver';

const outputSchema = v.nullable(
  v.object({
    userId: v.string(),
    userEmail: v.nullable(v.string()),
  }),
);

export const getUser = createRouteResolver({
  output: outputSchema,
  middlewares: [preAuthMiddleware],
  resolve: async () => {
    const { authUser }: PreAuth = ctx.get(CTX_GLOBAL_KEYS.PRE_AUTH);

    const user = await litellm.getUser({
      userId: authUser.id,
    });

    if (!user) {
      return null;
    }

    return {
      userId: user.userId,
      userEmail: user.userEmail,
    };
  },
});
