import { createRouteResolver } from '../../middlewares/route-resolver';
import { adminLitellmApiClient } from '../../../services/litellm-api-client';
import * as v from 'valibot';
import { INPUT_LIMITS } from '../../../utils/consts';
import { adminAuthMiddleware } from '../../middlewares/auth';

const inputSchema = v.object({
  serviceAccountId: v.string(),
  keyAlias: v.optional(
    v.pipe(v.string(), v.maxLength(INPUT_LIMITS.KEY_ALIAS_MAX_LENGTH)),
  ),
});

const outputSchema = v.object({
  key: v.string(),
  expires: v.nullable(v.string()),
});

export const generateServiceAccount = createRouteResolver({
  inputs: {
    body: inputSchema,
  },
  output: outputSchema,
  middlewares: [adminAuthMiddleware],
  resolve: async ({ inputs: { body } }) => {
    const { key, expires } = await adminLitellmApiClient.generateServiceAccount(
      {
        serviceAccountId: body.serviceAccountId,
        keyAlias: body.keyAlias,
        models: ['all-team-models'],
        teamId: undefined, // TODO
      },
    );

    return {
      key,
      expires,
    };
  },
});
