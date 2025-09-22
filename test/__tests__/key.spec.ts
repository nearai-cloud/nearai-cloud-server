import { mockUsers } from '../utils/users';
import * as api from '../utils/api';
import { setup, tearDown } from '../utils/setup';
import { createHash } from 'crypto';
import { LITELLM_MASTER_KEY } from '../utils/consts';
import { SetupContext } from '../types/context';

type Context = SetupContext & {
  aliceKey?: string;
  aliceKeyHash?: string;
};

describe('key api', () => {
  let ctx: Context;

  beforeAll(async () => {
    ctx = await setup();
  });

  afterAll(async () => {
    await tearDown();
  });

  test('generate key with invalid authorization', async () => {
    const res = await api.generateKey({
      agent: ctx.agent,
      body: {
        keyAlias: 'alice-key',
      },
      authorization: 'sk-invalid',
    });

    expect(res.status).toEqual(401);
    expect(res.error).toBeTruthy();
    expect(res.error!.message).toMatch('Invalid authorization token');
  });

  test('generate key', async () => {
    const res = await api.generateKey({
      agent: ctx.agent,
      body: {
        keyAlias: 'alice-key',
      },
      authorization: mockUsers.alice.supabaseAuthorization,
    });

    expect(res.status).toEqual(200);
    expect(res.data).toBeTruthy();

    const aliceKey = res.data!.key;
    ctx.aliceKey = aliceKey;
    ctx.aliceKeyHash = createHash('sha256')
      .update(aliceKey)
      .digest()
      .toString('hex');
  });

  test('generate service account with invalid authorization', async () => {
    const res = await api.generateServiceAccount({
      agent: ctx.agent,
      body: {
        serviceAccountId: 'test',
      },
      authorization: 'sk-invalid',
    });

    expect(res.status).toEqual(403);
    expect(res.error).toBeTruthy();
    expect(res.error!.message).toMatch('Only admin can access this endpoint');
  });

  test('generate service account', async () => {
    const res = await api.generateServiceAccount({
      agent: ctx.agent,
      body: {
        serviceAccountId: 'test-key-api',
      },
      authorization: LITELLM_MASTER_KEY,
    });

    expect(res.status).toEqual(200);
    expect(res.data).toBeTruthy();
    expect(res.data!.key).toMatch(/^sk-/);
  });

  test('get key with invalid authorization', async () => {
    const res = await api.getKey({
      agent: ctx.agent,
      query: {
        keyHash: ctx.aliceKeyHash!,
      },
      authorization: 'sk-invalid',
    });

    expect(res.status).toEqual(401);
    expect(res.error).toBeTruthy();
    expect(res.error!.message).toMatch('Invalid authorization token');
  });

  test('get key owned by other users', async () => {
    const res = await api.getKey({
      agent: ctx.agent,
      query: {
        keyHash: ctx.aliceKeyHash!,
      },
      authorization: mockUsers.bob.supabaseAuthorization,
    });

    expect(res.status).toEqual(403);
    expect(res.error).toBeTruthy();
    expect(res.error!.message).toMatch(
      'No permission to access the key that is owned by other users',
    );
  });

  test('get key', async () => {
    const res = await api.getKey({
      agent: ctx.agent,
      query: {
        keyHash: ctx.aliceKeyHash!,
      },
      authorization: mockUsers.alice.supabaseAuthorization,
    });

    expect(res.status).toEqual(200);
    expect(res.data).toBeTruthy();
    expect(res.data!.keyHash).toEqual(ctx.aliceKeyHash!);
    expect(res.data!.keyAlias).toEqual('alice-key');
  });

  test('list keys with invalid authorization', async () => {
    const res = await api.listKeys({
      agent: ctx.agent,
      authorization: 'sk-invalid',
    });

    expect(res.status).toEqual(401);
    expect(res.error).toBeTruthy();
    expect(res.error!.message).toEqual('Invalid authorization token');
  });

  test('list keys', async () => {
    const res = await api.listKeys({
      agent: ctx.agent,
      authorization: mockUsers.alice.supabaseAuthorization,
    });

    expect(res.status).toEqual(200);
    expect(res.data).toBeTruthy();
    expect(res.data!.keys.length).toEqual(1);
  });

  test('update key with invalid authorization', async () => {
    const res = await api.updateKey({
      agent: ctx.agent,
      body: {
        keyHash: ctx.aliceKeyHash!,
        keyAlias: 'updated-alice-key',
      },
      authorization: 'sk-invalid',
    });

    expect(res.status).toEqual(401);
    expect(res.error).toBeTruthy();
    expect(res.error!.message).toEqual('Invalid authorization token');
  });

  test('update key owned by other users', async () => {
    const res = await api.updateKey({
      agent: ctx.agent,
      body: {
        keyHash: ctx.aliceKeyHash!,
        keyAlias: 'bob-update-alice-key',
      },
      authorization: mockUsers.bob.supabaseAuthorization,
    });

    expect(res.status).toEqual(403);
    expect(res.error).toBeTruthy();
    expect(res.error!.message).toMatch(
      'No permission to access the key that is owned by other users',
    );
  });

  test('update key that does not exist', async () => {
    const res = await api.updateKey({
      agent: ctx.agent,
      body: {
        keyHash: '1'.repeat(64),
        keyAlias: 'update-alice-key',
      },
      authorization: mockUsers.alice.supabaseAuthorization,
    });

    expect(res.status).toEqual(400);
    expect(res.error).toBeTruthy();
    expect(res.error!.message).toMatch(
      'Cannot update a key that does not exist',
    );
  });

  test('update key', async () => {
    const updateKeyRes = await api.updateKey({
      agent: ctx.agent,
      body: {
        keyHash: ctx.aliceKeyHash!,
        keyAlias: 'update-alice-key',
      },
      authorization: mockUsers.alice.supabaseAuthorization,
    });

    expect(updateKeyRes.status).toEqual(204);

    const getKeyRes = await api.getKey({
      agent: ctx.agent,
      query: {
        keyHash: ctx.aliceKeyHash!,
      },
      authorization: mockUsers.alice.supabaseAuthorization,
    });

    expect(getKeyRes.status).toEqual(200);
    expect(getKeyRes.data).toBeTruthy();
    expect(getKeyRes.data!.keyHash).toEqual(ctx.aliceKeyHash!);
    expect(getKeyRes.data!.keyAlias).toEqual('update-alice-key');
  });

  test('delete key with invalid authorization', async () => {
    const res = await api.deleteKey({
      agent: ctx.agent,
      body: {
        keyHash: ctx.aliceKeyHash!,
      },
      authorization: 'sk-invalid',
    });

    expect(res.status).toEqual(401);
    expect(res.error).toBeTruthy();
    expect(res.error!.message).toEqual('Invalid authorization token');
  });

  test('delete key owned by other users', async () => {
    const res = await api.deleteKey({
      agent: ctx.agent,
      body: {
        keyHash: ctx.aliceKeyHash!,
      },
      authorization: mockUsers.bob.supabaseAuthorization,
    });

    expect(res.status).toEqual(403);
    expect(res.error).toBeTruthy();
    expect(res.error!.message).toMatch(
      'No permission to access the key that is owned by other users',
    );
  });

  test('delete key', async () => {
    const deleteKeyRes = await api.deleteKey({
      agent: ctx.agent,
      body: {
        keyHash: ctx.aliceKeyHash!,
      },
      authorization: mockUsers.alice.supabaseAuthorization,
    });

    expect(deleteKeyRes.status).toEqual(204);

    const getKeyRes = await api.getKey({
      agent: ctx.agent,
      query: {
        keyHash: ctx.aliceKeyHash!,
      },
      authorization: mockUsers.alice.supabaseAuthorization,
    });

    expect(getKeyRes.status).toEqual(200);
    expect(getKeyRes.data).toBeNull();

    const listKeysRes = await api.listKeys({
      agent: ctx.agent,
      authorization: mockUsers.alice.supabaseAuthorization,
    });

    expect(listKeysRes.status).toEqual(200);
    expect(listKeysRes.data).toBeTruthy();
    expect(listKeysRes.data!.keys.length).toEqual(0);
  });
});
