import { createRouteResolver } from '../../middlewares/route-resolver';
import * as v from 'valibot';
import { supabaseAuthMiddleware } from '../../middlewares/auth';
import { adminLitellmApiClient } from '../../../services/litellm-api-client';

const outputSchema = v.array(
  v.object({
    model: v.string(),
    internalModel: v.string(),
    internalModelProvider: v.string(),
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
  middlewares: [supabaseAuthMiddleware],
  resolve: async () => {
    return adminLitellmApiClient.listModels();
  },
});
