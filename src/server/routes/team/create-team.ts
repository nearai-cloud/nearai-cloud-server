import { createRouteResolver } from '../../middlewares/route-resolver';
import { litellmServiceAccountAuthMiddleware } from '../../middlewares/auth';
import * as v from 'valibot';
import { adminLitellmApiClient } from '../../../services/litellm-api-client';

const inputSchema = v.object({
  teamId: v.optional(v.string()),
  teamAlias: v.string(),
  maxBudget: v.optional(v.number()),
  models: v.optional(v.array(v.string())),
});

const outputSchema = v.object({
  teamId: v.string(),
});

export const createTeam = createRouteResolver({
  inputs: {
    body: inputSchema,
  },
  output: outputSchema,
  middlewares: [litellmServiceAccountAuthMiddleware],
  resolve: async ({ inputs: { body } }) => {
    return adminLitellmApiClient.createTeam({
      teamId: body.teamId ?? body.teamAlias,
      teamAlias: body.teamAlias,
      maxBudget: body.maxBudget,
      models: body.models ?? ['all-proxy-models'],
    });
  },
});
