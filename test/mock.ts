import { AuthError, User } from "@supabase/supabase-js";

export const mockUsers = {
  alice: {
    id: 'alice',
    email: 'alice@gmail.com',
    supabaseAuthToken: 'Bearer alice',
  },
};

type MockUserResponse = {
  data: {
    user: Partial<User>; // We just use partial fields
  },
  error: null
} | {
  data: {
    user: null;
  },
  error: AuthError;
}

jest.mock('@supabase/supabase-js', () => {
  const originalModule = jest.requireActual('@supabase/supabase-js');

  return {
    ...originalModule,
    createClient: jest.fn(() => ({
      auth: {
        getUser: jest.fn(async (jwt?: string): Promise<MockUserResponse> => {
          if (!jwt) {
            return {
              data: {
                user: null
              },
              error: new AuthError('Invalid authorization', 401),
            }
          }

          const user = Object.values(mockUsers).find(user => user.supabaseAuthToken === jwt)

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
              }
            },
            error: null,
          }
        }),
      },
    })),
  };
});
