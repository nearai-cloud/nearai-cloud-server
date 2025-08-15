import { createRouteResolver } from '../../middlewares/route-resolver';
import * as v from 'valibot';
import { litellmServiceAccountAuthMiddleware } from '../../middlewares/auth';
import { adminLitellmApiClient } from '../../../services/litellm-api-client';

const inputSchema = v.object({
  model: v.string(),
  providerModelName: v.string(),
  providerName: v.string(),
  credentialName: v.string(),
  inputCostPerToken: v.optional(v.number()),
  outputCostPerToken: v.optional(v.number()),
  metadata: v.object({
    verifiable: v.boolean(),
    contextLength: v.number(),
    modelFullName: v.string(),
    modelDescription: v.string(),
    modelIcon: v.string(),
  }),
});

export const createModel = createRouteResolver({
  inputs: {
    body: inputSchema,
  },
  middlewares: [litellmServiceAccountAuthMiddleware],
  resolve: async ({ inputs: { body } }) => {
    await adminLitellmApiClient.createModel({
      model: body.model,
      providerModelName: body.providerModelName,
      providerName: body.providerName,
      credentialName: body.credentialName,
      inputCostPerToken: body.inputCostPerToken,
      outputCostPerToken: body.outputCostPerToken,
      metadata: body.metadata,
    });
  },
});
