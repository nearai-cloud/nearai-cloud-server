import * as supabase from '@supabase/supabase-js';
import { mockUsers } from '../../utils/users';

// export original module
export * from '@supabase/supabase-js';

// Overwrite `createClient` with a mocked function
export const createClient = jest.fn(() => ({
  auth: {
    getUser: jest.fn(async (jwt?: string): Promise<supabase.UserResponse> => {
      if (!jwt) {
        return {
          data: {
            user: null,
          },
          error: new supabase.AuthError('Invalid authorization token', 401),
        };
      }

      const user = Object.values(mockUsers).find(
        (user) => user.supabaseAuthorization === jwt,
      );

      if (!user) {
        return {
          data: {
            user: null,
          },
          error: new supabase.AuthError('Invalid authorization token', 401),
        };
      }

      return {
        data: {
          user: {
            id: user.id,
            email: user.email,
            user_metadata: {
              email_verified: true,
            },
            app_metadata: {
              provider: 'email',
              providers: ['email'],
            },
            aud: 'authenticated',
            created_at: '2025-01-01T00:00:00.000000Z',
          },
        },
        error: null,
      };
    }),
  },
}));
