import { createRouteResolver } from '../../middlewares/route-resolver';
import { litellmServiceAccountAuthMiddleware } from '../../middlewares/auth';
import * as v from 'valibot';
import { adminLitellmApiClient } from '../../../services/litellm-api-client';

const inputSchema = v.object({
  teamId: v.string(),
  teamAlias: v.optional(v.string()),
  maxBudget: v.optional(v.number()),
  models: v.optional(v.array(v.string())),
});

export const updateTeam = createRouteResolver({
  inputs: {
    body: inputSchema,
  },
  middlewares: [litellmServiceAccountAuthMiddleware],
  resolve: async ({ inputs: { body } }) => {
    await adminLitellmApiClient.updateTeam({
      teamId: body.teamId,
      teamAlias: body.teamAlias,
      maxBudget: body.maxBudget,
      models: body.models,
    });
  },
});
