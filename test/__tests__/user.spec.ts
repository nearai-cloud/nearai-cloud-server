import { Agent } from 'supertest';
import { mockUsers } from '../utils/users';
import * as api from '../utils/api';
import { setup, tearDown } from '../utils/setup';
import { LITELLM_MASTER_KEY } from '../utils/docker';

describe('user api', () => {
  let agent: Agent;
  let serviceAccountKeyForListingUsers: string;

  beforeAll(async () => {
    agent = await setup();
  });

  afterAll(async () => {
    await tearDown();
  });

  test('get user with invalid authorization', async () => {
    const res = await api.getUser({
      agent,
      authorization: 'invalid-token',
    });

    expect(res.status).toEqual(401);
    expect(res.error).toBeTruthy();
    expect(res.error!.message).toContain('Invalid authorization token');
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
      authorization: 'invalid-token',
    });

    expect(res.status).toEqual(401);
    expect(res.error).toBeTruthy();
    expect(res.error!.message).toContain('Invalid authorization token');
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

  test('generate service account key for listing users with invalid authorization', async () => {
    const res = await api.generateServiceAccount({
      agent,
      input: {
        serviceAccountId: 'list-user-service-account',
      },
      authorization: 'invalid-token',
    });

    expect(res.status).toEqual(403);
    expect(res.error).toBeTruthy();
    expect(res.error!.message).toContain('Only admin can access this endpoint');
  });

  test('generate service account key for listing users', async () => {
    const res = await api.generateServiceAccount({
      agent,
      input: {
        serviceAccountId: 'list-user-service-account',
      },
      authorization: LITELLM_MASTER_KEY,
    });

    expect(res.status).toEqual(200);
    expect(res.output).toBeTruthy();

    serviceAccountKeyForListingUsers = res.output!.key;
  });

  test('list users with invalid authorization', async () => {
    const res = await api.listUsers({
      agent,
      authorization: 'invalid-token',
    });

    expect(res.status).toEqual(401);
    expect(res.error).toBeTruthy();
    expect(res.error!.message).toContain('Invalid authorization token');
  });

  test('list users', async () => {
    const res = await api.listUsers({
      agent,
      authorization: serviceAccountKeyForListingUsers,
    });

    expect(res.status).toEqual(200);
    expect(res.output).toBeTruthy();
    expect(res.output!.users.length).toEqual(1);
  });
});
