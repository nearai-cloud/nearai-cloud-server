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
    const aliceResponse = await agent
      .get('/user/info')
      .auth(mockUsers.alice.supabaseAuthorization, { type: 'bearer' });

    expect(aliceResponse.status).toEqual(200);

    const randomUserResponse = await agent
      .get('/user/info')
      .auth('Bearer random-user', { type: 'bearer' });

    expect(randomUserResponse.status).toEqual(401);
  });
});
