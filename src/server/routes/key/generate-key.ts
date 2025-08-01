import ctx from 'express-http-context';
import * as v from 'valibot';
import { lightLLM } from '../../../services/light-llm';
import { CTX_GLOBAL_KEYS, INPUT_LIMITS } from '../../../utils/consts';
import { Auth, auth } from '../../middlewares/auth';
import { createRouteHandler } from '../../middlewares/parse';
import { RouteHandler } from '../../../types/parsers';

const bodyInputSchema = v.object({
  keyAlias: v.optional(
    v.pipe(v.string(), v.maxLength(INPUT_LIMITS.KEY_ALIAS_MAX_LENGTH)),
  ),
});

const outputSchema = v.object({
  key: v.string(),
  expires: v.nullable(v.string()),
});

export const generateKey: RouteHandler = createRouteHandler({
  bodyInputSchema,
  outputSchema,
  preHandle: [auth],
  handle: async ({ body }) => {
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
