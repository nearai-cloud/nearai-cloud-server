import ctx from 'express-http-context';
import * as v from 'valibot';
import { lightLLM } from '../../../services/light-llm';
import { CTX_GLOBAL_KEYS, INPUT_LIMITS } from '../../../utils/consts';
import { Auth, authMiddleware } from '../../middlewares/auth';
import { createRouteResolver } from '../../middlewares/route-resolver';
import { RouteResolver } from '../../../types/route-resolver';

const bodyInputSchema = v.object({
  keyAlias: v.optional(
    v.pipe(v.string(), v.maxLength(INPUT_LIMITS.KEY_ALIAS_MAX_LENGTH)),
  ),
});

const outputSchema = v.object({
  key: v.string(),
  expires: v.nullable(v.string()),
});

export const generateKey: RouteResolver = createRouteResolver({
  bodyInputSchema,
  outputSchema,
  middlewares: [authMiddleware],
  resolve: async ({ body }) => {
    const { user }: Auth = ctx.get(CTX_GLOBAL_KEYS.AUTH);

    const { key, expires } = await lightLLM.generateKey({
      userId: user.userId,
      keyAlias: body.keyAlias,
      models: ['all-team-models'],
      teamId: undefined, // TODO: Specify a team id
    });

    return {
      key,
      expires,
    };
  },
});
