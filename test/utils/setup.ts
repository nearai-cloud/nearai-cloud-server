import { setupContainers, teardownContainers } from './docker';
import { setupServer } from './server';
import { SetupContext } from '../types/context';
import { mockUsers } from './users';
import * as api from './api';

export async function setup({
  registerMockUsers = true,
}: {
  registerMockUsers?: boolean;
} = {}): Promise<SetupContext> {
  // Clear the cache left from the previous round of testing
  await teardownContainers();

  await setupContainers();

  const agent = setupServer();

  if (registerMockUsers) {
    for (const mockUser of Object.values(mockUsers)) {
      const aliceRes = await api.registerUser({
        agent,
        authorization: mockUser.supabaseAuthorization,
      });

      expect(aliceRes.status).toEqual(204);
    }
  }

  return { agent };
}

export async function tearDown() {
  await teardownContainers();
}
