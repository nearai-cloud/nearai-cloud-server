import { createRouteResolver } from '../../middlewares/route-resolver';
import * as v from 'valibot';
import { supabaseAuthMiddleware } from '../../middlewares/auth';
import { adminLitellmApiClient } from '../../../services/litellm-api-client';

const inputSchema = v.object({
  modelId: v.string(),
});

const outputSchema = v.nullable(
  v.object({
    model: v.string(),
    providerModelName: v.string(),
    providerName: v.string(),
    credentialName: v.string(),
    inputCostPerToken: v.number(),
    outputCostPerToken: v.number(),
    metadata: v.object({
      verifiable: v.boolean(),
      contextLength: v.number(),
      modelFullName: v.string(),
      modelDescription: v.string(),
      modelIcon: v.string(),
    }),
  }),
);

export const getModel = createRouteResolver({
  inputs: {
    query: inputSchema,
  },
  output: outputSchema,
  middlewares: [supabaseAuthMiddleware],
  resolve: async ({ inputs: { query } }) => {
    return adminLitellmApiClient.getModel({
      modelId: query.modelId,
    });
  },
});
