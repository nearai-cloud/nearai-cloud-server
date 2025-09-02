import ctx from 'express-http-context';
import * as v from 'valibot';
import { adminLitellmApiClient } from '../../../services/litellm-api-client';
import { CTX_GLOBAL_KEYS, INPUT_LIMITS } from '../../../utils/consts';
import { Auth, authMiddleware } from '../../middlewares/auth';
import { createRouteResolver } from '../../middlewares/route-resolver';
import { toFullKeyAlias } from '../../../utils/common';

export const inputSchema = v.object({
  keyAlias: v.pipe(v.string(), v.maxLength(INPUT_LIMITS.KEY_ALIAS_MAX_LENGTH)),
  maxBudget: v.optional(v.number()),
});

export const outputSchema = v.object({
  key: v.string(),
  expires: v.nullable(v.string()),
});

export const generateKey = createRouteResolver({
  inputs: {
    body: inputSchema,
  },
  output: outputSchema,
  middlewares: [authMiddleware],
  resolve: async ({ inputs: { body } }) => {
    const { user }: Auth = ctx.get(CTX_GLOBAL_KEYS.AUTH);

    const { key, expires } = await adminLitellmApiClient.generateKey({
      keyType: 'llm_api',
      userId: user.userId,
      keyAlias: toFullKeyAlias(user.userId, body.keyAlias),
      models: ['all-team-models'],
      maxBudget: body.maxBudget,
    });

    return {
      key,
      expires,
    };
  },
});
