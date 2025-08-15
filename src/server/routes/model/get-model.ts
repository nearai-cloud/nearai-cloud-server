import { createRouteResolver } from '../../middlewares/route-resolver';
import * as v from 'valibot';
import { authMiddleware } from '../../middlewares/auth';
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
      verifiable: v.nullable(v.boolean()),
      contextLength: v.nullable(v.number()),
      modelFullName: v.nullable(v.string()),
      modelDescription: v.nullable(v.string()),
      modelIcon: v.nullable(v.string()),
    }),
  }),
);

export const getModel = createRouteResolver({
  inputs: {
    query: inputSchema,
  },
  output: outputSchema,
  middlewares: [authMiddleware],
  resolve: async ({ inputs: { query } }) => {
    return adminLitellmApiClient.getModel({
      modelId: query.modelId,
    });
  },
});
