import { createRouteResolver } from '../../middlewares/route-resolver';
import * as v from 'valibot';
import { authMiddleware } from '../../middlewares/auth';
import { adminLitellmApiClient } from '../../../services/litellm-api-client';

const outputSchema = v.array(
  v.object({
    modelId: v.string(),
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

export const listModels = createRouteResolver({
  output: outputSchema,
  middlewares: [authMiddleware],
  resolve: async () => {
    return adminLitellmApiClient.listModels();
  },
});
