import { Agent } from 'supertest';
import { mockUsers } from '../utils/users';
import * as api from '../utils/api';
import { setup, tearDown } from '../utils/setup';
import { LITELLM_MASTER_KEY } from '../utils/consts';

describe('user api', () => {
  let agent: Agent;

  const alice = mockUsers.alice;

  let serviceAccount: string;

  beforeAll(async () => {
    agent = await setup();
  });

  afterAll(async () => {
    await tearDown();
  });

  test('setup', async () => {
    // Generate service account
    const res = await api.generateServiceAccount({
      agent,
      body: {
        serviceAccountId: 'test-user-api',
      },
      authorization: LITELLM_MASTER_KEY,
    });

    expect(res.status).toEqual(200);
    expect(res.data).toBeTruthy();
    serviceAccount = res.data!.key;
  });

  test('register user with invalid authorization', async () => {
    const res = await api.registerUser({
      agent,
      authorization: 'sk-invalid',
    });

    expect(res.status).toEqual(401);
    expect(res.error).toBeTruthy();
    expect(res.error!.message).toMatch('Invalid authorization token');
  });

  test('register user', async () => {
    const res = await api.registerUser({
      agent,
      authorization: alice.supabaseAuthorization,
    });

    expect(res.status).toEqual(204);
  });

  test('register user twice', async () => {
    const res = await api.registerUser({
      agent,
      authorization: alice.supabaseAuthorization,
    });

    expect(res.status).toEqual(400);
    expect(res.error).toBeTruthy();
    expect(res.error!.message).toMatch(
      `User with email ${alice.email} already exists`,
    );
  });

  test('get user with invalid authorization', async () => {
    const res = await api.getUser({
      agent,
      authorization: 'sk-invalid',
    });

    expect(res.status).toEqual(401);
    expect(res.error).toBeTruthy();
    expect(res.error!.message).toMatch('Invalid authorization token');
  });

  test('get user', async () => {
    const res = await api.getUser({
      agent,
      authorization: alice.supabaseAuthorization,
    });

    expect(res.status).toEqual(200);
    expect(res.data).toBeTruthy();
    expect(res.data!.userId).toEqual(alice.id);
  });

  test('list users with invalid authorization', async () => {
    const res = await api.listUsers({
      agent,
      authorization: 'sk-invalid',
    });

    expect(res.status).toEqual(401);
    expect(res.error).toBeTruthy();
    expect(res.error!.message).toMatch('Invalid authorization token');
  });

  test('list users', async () => {
    const res = await api.listUsers({
      agent,
      authorization: serviceAccount,
    });

    expect(res.status).toEqual(200);
    expect(res.data).toBeTruthy();
    expect(res.data!.users.length).toEqual(1);
  });
});
