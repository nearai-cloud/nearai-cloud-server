import { Agent } from 'supertest';
import { mockUsers } from '../utils/users';
import { simulateStartServer, simulateStopServer } from '../utils/server';

describe('Auth', () => {
  let agent: Agent;

  beforeAll(() => {
    agent = simulateStartServer();
  });

  afterAll(() => {
    simulateStopServer();
  });

  test('Mocked Supabase Auth', async () => {
    const res1 = await agent
      .get('/user/info')
      .auth(mockUsers.alice.supabaseAuthorization, { type: 'bearer' });

    expect(res1.status).toEqual(200);

    const res2 = await agent
      .get('/user/info')
      .auth('Bearer random-token', { type: 'bearer' });

    expect(res2.status).toEqual(401);
  });
});
