import { createRouteResolver } from '../../middlewares/route-resolver';
import * as v from 'valibot';
import { authMiddleware } from '../../middlewares/auth';
import { adminLitellmApiClient } from '../../../services/litellm-api-client';

const outputSchema = v.array(
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

export const listModels = createRouteResolver({
  output: outputSchema,
  middlewares: [authMiddleware],
  resolve: async () => {
    return adminLitellmApiClient.listModels();
  },
});
