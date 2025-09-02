import { Agent } from 'supertest';
import { mockUsers } from '../utils/users';
import * as api from '../utils/api';
import { setup, tearDown } from '../utils/setup';

describe('user api', () => {
  let agent: Agent;

  beforeAll(async () => {
    agent = await setup();
  });

  afterAll(async () => {
    await tearDown();
  });

  test('get user with invalid authorization', async () => {
    const res = await api.getUser({
      agent,
      authorization: 'Bearer invalid-user',
    });

    expect(res.status).toEqual(401);
    expect(res.error).toBeTruthy();
    expect(res.error!.message).toEqual('Failed to authorize');
  });

  test('get user before registration', async () => {
    const res = await api.getUser({
      agent,
      authorization: mockUsers.alice.supabaseAuthorization,
    });

    expect(res.status).toEqual(200);
    expect(res.output).toBeNull();
  });

  test('register user with invalid authorization', async () => {
    const res = await api.registerUser({
      agent,
      authorization: 'Bearer invalid-user',
    });

    expect(res.status).toEqual(401);
    expect(res.error).toBeTruthy();
    expect(res.error!.message).toEqual('Failed to authorize');
  });

  test('register user', async () => {
    const res = await api.registerUser({
      agent,
      authorization: mockUsers.alice.supabaseAuthorization,
    });

    expect(res.status).toEqual(204);
  });

  test('register user twice', async () => {
    const res = await api.registerUser({
      agent,
      authorization: mockUsers.alice.supabaseAuthorization,
    });

    expect(res.status).toEqual(400);
    expect(res.error).toBeTruthy();
    expect(res.error!.message).toContain(
      `User with email ${mockUsers.alice.email} already exists`,
    );
  });

  test('get user after registration', async () => {
    const res = await api.getUser({
      agent,
      authorization: mockUsers.alice.supabaseAuthorization,
    });

    expect(res.status).toEqual(200);
    expect(res.output).toBeTruthy();
    expect(res.output!.userId).toEqual(mockUsers.alice.id);
  });

  test('get user after registration', async () => {
    const res = await api.getUser({
      agent,
      authorization: mockUsers.alice.supabaseAuthorization,
    });

    expect(res.status).toEqual(200);
    expect(res.output).toBeTruthy();
    expect(res.output!.userId).toEqual(mockUsers.alice.id);
  });
});
