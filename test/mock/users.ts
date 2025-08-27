export type MockUser = {
  id: string;
  email: string;
  supabaseAuthorization: string;
}

export const mockUsers: Record<string, MockUser> = {
  alice: {
    id: 'alice',
    email: 'alice@gmail.com',
    supabaseAuthorization: 'Bearer alice',
  },
};
