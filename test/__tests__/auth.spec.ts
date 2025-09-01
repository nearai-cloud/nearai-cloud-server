import { Agent } from 'supertest';
import { mockUsers } from '../utils/users';
import { setupServer, teardownServer } from '../utils/server';
import * as api from '../utils/api';

describe('Auth', () => {
  let agent: Agent;

  beforeAll(() => {
    agent = setupServer();
  });

  afterAll(() => {
    teardownServer();
  });

  test('Mocked Supabase Auth', async () => {
    const alice = await api.getUser(agent, {
      authorization: mockUsers.alice.supabaseAuthorization,
    });

    expect(alice).toBeNull(); // User registered on Supabase while not registered on NEAR AI Cloud

    await expect(
      api.getUser(agent, {
        authorization: 'Bearer random-user',
      }),
    ).rejects.toEqual('');
  });
});
