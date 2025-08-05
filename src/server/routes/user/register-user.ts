import ctx from 'express-http-context';
import { adminLitellmClient } from '../../../services/litellm';
import { CTX_GLOBAL_KEYS } from '../../../utils/consts';
import { SupabaseAuth, supabaseAuthMiddleware } from '../../middlewares/auth';
import { createRouteResolver } from '../../middlewares/route-resolver';

export const registerUser = createRouteResolver({
  middlewares: [supabaseAuthMiddleware],
  resolve: async () => {
    const { supabaseUser }: SupabaseAuth = ctx.get(
      CTX_GLOBAL_KEYS.SUPABASE_AUTH,
    );

    await adminLitellmClient.registerUser({
      userId: supabaseUser.id,
      userEmail: supabaseUser.email,
    });
  },
});
