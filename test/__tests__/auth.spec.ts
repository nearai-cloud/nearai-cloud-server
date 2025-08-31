import { Express } from 'express';
import request from 'supertest';
import { mockUsers } from '../utils/users';
import { simulateStartServer, simulateStopServer } from '../utils/server';

describe('Auth', () => {
  let server: Express;

  beforeAll(() => {
    server = simulateStartServer();
  });

  afterAll(() => {
    simulateStopServer();
  });

  test('Mocked Supabase Auth', async () => {
    await request(server)
      .get('/user/info')
      .auth(mockUsers.alice.supabaseAuthorization, { type: 'bearer' })
      .expect(200);

    await request(server)
      .get('/user/info')
      .auth('Bearer random-token', { type: 'bearer' })
      .expect(401);
  });
});
