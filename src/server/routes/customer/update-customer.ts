import { adminLitellmApiClient } from '../../../services/litellm-api-client';
import { litellmServiceAccountAuthMiddleware } from '../../middlewares/auth';
import { createRouteResolver } from '../../middlewares/route-resolver';

export const updateCustomer = createRouteResolver({
  middlewares: [litellmServiceAccountAuthMiddleware],
  resolve: async ({ req }) => {
    return adminLitellmApiClient.updateCustomer(req.body);
  },
});
