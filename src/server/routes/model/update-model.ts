import { createRouteResolver } from '../../middlewares/route-resolver';
import * as v from 'valibot';
import { litellmServiceAccountAuthMiddleware } from '../../middlewares/auth';
import { adminLitellmApiClient } from '../../../services/litellm-api-client';

const inputSchema = v.object({
  model: v.string(),
  internalModel: v.optional(v.string()),
  internalModelProvider: v.optional(v.string()),
  credentialName: v.optional(v.string()),
  inputCostPerToken: v.optional(v.number()),
  outputCostPerToken: v.optional(v.number()),
  metadata: v.optional(
    v.object({
      verifiable: v.optional(v.boolean()),
      contextLength: v.optional(v.number()),
      modelFullName: v.optional(v.string()),
      modelDescription: v.optional(v.string()),
      modelIcon: v.optional(v.string()),
    }),
  ),
});

export const updateModel = createRouteResolver({
  inputs: {
    body: inputSchema,
  },
  middlewares: [litellmServiceAccountAuthMiddleware],
  resolve: async ({ inputs: { body } }) => {
    await adminLitellmApiClient.updateModel({
      model: body.model,
      internalModel: body.internalModel,
      internalModelProvider: body.internalModelProvider,
      credentialName: body.credentialName,
      inputCostPerToken: body.inputCostPerToken,
      outputCostPerToken: body.outputCostPerToken,
      metadata: body.metadata,
    });
  },
});
