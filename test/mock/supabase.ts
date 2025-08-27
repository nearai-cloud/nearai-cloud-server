import { AuthError, UserResponse } from "@supabase/supabase-js";
import { mockUsers } from "./users";

jest.mock('@supabase/supabase-js', () => {
  const originalModule = jest.requireActual('@supabase/supabase-js');

  return {
    ...originalModule,
    createClient: jest.fn(() => ({
      auth: {
        getUser: jest.fn(async (jwt?: string): Promise<UserResponse> => {
          if (!jwt) {
            return {
              data: {
                user: null
              },
              error: new AuthError('Invalid authorization', 401),
            }
          }

          const user = Object.values(mockUsers).find(user => user.supabaseAuthorization === jwt)

          if (!user) {
            return {
              data: {
                user: null
              },
              error: new AuthError('Invalid authorization', 401),
            }
          }

          return {
            data: {
              user: {
                id: user.id,
                email: user.email,
                user_metadata: {},
                app_metadata: {},
                aud: 'authenticated',
                created_at: '2025-01-01T00:00:00.000000Z',
              }
            },
            error: null,
          }
        }),
      },
    })),
  };
});
