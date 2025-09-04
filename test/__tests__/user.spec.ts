import { mockUsers } from '../utils/users';
import * as api from '../utils/api';
import { setup, tearDown } from '../utils/setup';
import { LITELLM_MASTER_KEY } from '../utils/consts';
import { SetupContext } from '../types/context';

type Context = SetupContext & {
  serviceAccount?: string;
};

describe('user api', () => {
  let ctx: Context;

  beforeAll(async () => {
    ctx = await setup({ registerMockUsers: false });
  });

  afterAll(async () => {
    await tearDown();
  });

  test('generate service account', async () => {
    const res = await api.generateServiceAccount({
      agent: ctx.agent,
      body: {
        serviceAccountId: 'test-user-api',
      },
      authorization: LITELLM_MASTER_KEY,
    });

    expect(res.status).toEqual(200);
    expect(res.data).toBeTruthy();

    ctx.serviceAccount = res.data!.key;
  });

  test('register user with invalid authorization', async () => {
    const res = await api.registerUser({
      agent: ctx.agent,
      authorization: 'sk-invalid',
    });

    expect(res.status).toEqual(401);
    expect(res.error).toBeTruthy();
    expect(res.error!.message).toMatch('Invalid authorization token');
  });

  test('register user', async () => {
    const res = await api.registerUser({
      agent: ctx.agent,
      authorization: mockUsers.alice.supabaseAuthorization,
    });

    expect(res.status).toEqual(204);
  });

  test('register user twice', async () => {
    const res = await api.registerUser({
      agent: ctx.agent,
      authorization: mockUsers.alice.supabaseAuthorization,
    });

    expect(res.status).toEqual(400);
    expect(res.error).toBeTruthy();
    expect(res.error!.message).toMatch(
      `User with email ${mockUsers.alice.email} already exists`,
    );
  });

  test('get user with invalid authorization', async () => {
    const res = await api.getUser({
      agent: ctx.agent,
      authorization: 'sk-invalid',
    });

    expect(res.status).toEqual(401);
    expect(res.error).toBeTruthy();
    expect(res.error!.message).toMatch('Invalid authorization token');
  });

  test('get user', async () => {
    const res = await api.getUser({
      agent: ctx.agent,
      authorization: mockUsers.alice.supabaseAuthorization,
    });

    expect(res.status).toEqual(200);
    expect(res.data).toBeTruthy();
    expect(res.data!.userId).toEqual(mockUsers.alice.id);
  });

  test('list users with invalid authorization', async () => {
    const res = await api.listUsers({
      agent: ctx.agent,
      authorization: 'sk-invalid',
    });

    expect(res.status).toEqual(401);
    expect(res.error).toBeTruthy();
    expect(res.error!.message).toMatch('Invalid authorization token');
  });

  test('list users', async () => {
    const res = await api.listUsers({
      agent: ctx.agent,
      authorization: ctx.serviceAccount,
    });

    expect(res.status).toEqual(200);
    expect(res.data).toBeTruthy();
    expect(res.data!.users.length).toEqual(1);
  });
});
