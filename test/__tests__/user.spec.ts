import { Agent } from 'supertest';
import { mockUsers } from '../utils/users';
import { setupServer, teardownServer } from '../utils/server';
import * as api from '../utils/api';
import { STATUS_CODES } from '../utils/consts';

describe('user api', () => {
  let agent: Agent;

  beforeAll(() => {
    agent = setupServer();
  });

  afterAll(() => {
    teardownServer();
  });

  test('get user with invalid authorization', async () => {
    const res = await api.getUser({
      agent,
      authorization: 'Bearer invalid-user',
    });

    expect(res.status).toEqual(STATUS_CODES.UNAUTHORIZED);
    expect(res.error!.message).toEqual('Failed to authorize');
  });

  test('get user before registration', async () => {
    const res = await api.getUser({
      agent,
      authorization: mockUsers.alice.supabaseAuthorization,
    });

    expect(res.status).toEqual(STATUS_CODES.OK);
    expect(res.output).toBeNull(); // User not registered
  });

  test('register user with invalid authorization', async () => {
    const res = await api.registerUser({
      agent,
      authorization: 'Bearer invalid-user',
    });

    expect(res.status).toEqual(STATUS_CODES.UNAUTHORIZED);
    expect(res.error!.message).toEqual('Failed to authorize');
  });

  test('register user', async () => {
    const res = await api.registerUser({
      agent,
      authorization: mockUsers.alice.supabaseAuthorization,
    });

    expect(res.status).toEqual(STATUS_CODES.NO_CONTENT);
  });

  test('register user twice', async () => {
    const res = await api.registerUser({
      agent,
      authorization: mockUsers.alice.supabaseAuthorization,
    });

    expect(res.status).toEqual(STATUS_CODES.BAD_REQUEST);
    expect(res.error!.message).toContain(
      `User with email ${mockUsers.alice.email} already exists`,
    );
  });

  test('get user after registration', async () => {
    const res = await api.getUser({
      agent,
      authorization: mockUsers.alice.supabaseAuthorization,
    });

    expect(res.status).toEqual(STATUS_CODES.OK);
    expect(res.output!.userId).toEqual(mockUsers.alice.id);
  });
});
