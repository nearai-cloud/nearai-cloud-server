import { Agent } from 'supertest';
import { mockUsers } from '../utils/users';
import * as api from '../utils/api';
import { setup, tearDown } from '../utils/setup';
import { createHash } from 'crypto';
import { LITELLM_MASTER_KEY } from '../utils/docker';

describe('key api', () => {
  let agent: Agent;

  const alice = mockUsers.alice;
  let aliceKey: string;
  let aliceKeyHash: string;

  const bob = mockUsers.bob;

  beforeAll(async () => {
    agent = await setup();
  });

  afterAll(async () => {
    await tearDown();
  });

  test('setup', async () => {
    // Register alice
    const aliceRes = await api.registerUser({
      agent,
      authorization: alice.supabaseAuthorization,
    });

    expect(aliceRes.status).toEqual(204);

    // Register bob
    const bobRes = await api.registerUser({
      agent,
      authorization: bob.supabaseAuthorization,
    });

    expect(bobRes.status).toEqual(204);
  });

  test('generate key with invalid authorization', async () => {
    const res = await api.generateKey({
      agent,
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
      agent,
      body: {
        keyAlias: 'alice-key',
      },
      authorization: alice.supabaseAuthorization,
    });

    expect(res.status).toEqual(200);
    expect(res.data).toBeTruthy();
    aliceKey = res.data!.key;
    aliceKeyHash = createHash('sha256')
      .update(aliceKey)
      .digest()
      .toString('hex');
  });

  test('generate service account with invalid authorization', async () => {
    const res = await api.generateServiceAccount({
      agent,
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
      agent,
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
      agent,
      query: {
        keyHash: aliceKeyHash,
      },
      authorization: 'sk-invalid',
    });

    expect(res.status).toEqual(401);
    expect(res.error).toBeTruthy();
    expect(res.error!.message).toMatch('Invalid authorization token');
  });

  test('get key owned by other users', async () => {
    const res = await api.getKey({
      agent,
      query: {
        keyHash: aliceKeyHash,
      },
      authorization: bob.supabaseAuthorization,
    });

    expect(res.status).toEqual(403);
    expect(res.error).toBeTruthy();
    expect(res.error!.message).toMatch(
      'No permission to access the key that is owned by other users',
    );
  });

  test('get key', async () => {
    const res = await api.getKey({
      agent,
      query: {
        keyHash: aliceKeyHash,
      },
      authorization: alice.supabaseAuthorization,
    });

    expect(res.status).toEqual(200);
    expect(res.data).toBeTruthy();
    expect(res.data!.keyHash).toEqual(aliceKeyHash);
    expect(res.data!.keyAlias).toEqual('alice-key');
  });

  test('list keys with invalid authorization', async () => {
    const res = await api.listKeys({
      agent,
      authorization: 'sk-invalid',
    });

    expect(res.status).toEqual(401);
    expect(res.error).toBeTruthy();
    expect(res.error!.message).toEqual('Invalid authorization token');
  });

  test('list keys', async () => {
    const res = await api.listKeys({
      agent,
      authorization: alice.supabaseAuthorization,
    });

    expect(res.status).toEqual(200);
    expect(res.data).toBeTruthy();
    expect(res.data!.keys.length).toEqual(1);
  });

  test('update key with invalid authorization', async () => {
    const res = await api.updateKey({
      agent,
      body: {
        keyHash: aliceKeyHash,
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
      agent,
      body: {
        keyHash: aliceKeyHash,
        keyAlias: 'bob-update-alice-key',
      },
      authorization: bob.supabaseAuthorization,
    });

    expect(res.status).toEqual(403);
    expect(res.error).toBeTruthy();
    expect(res.error!.message).toMatch(
      'No permission to access the key that is owned by other users',
    );
  });

  test('update key', async () => {
    const updateKeyRes = await api.updateKey({
      agent,
      body: {
        keyHash: aliceKeyHash,
        keyAlias: 'update-alice-key',
      },
      authorization: alice.supabaseAuthorization,
    });

    expect(updateKeyRes.status).toEqual(204);

    const getKeyRes = await api.getKey({
      agent,
      query: {
        keyHash: aliceKeyHash,
      },
      authorization: alice.supabaseAuthorization,
    });

    expect(getKeyRes.status).toEqual(200);
    expect(getKeyRes.data).toBeTruthy();
    expect(getKeyRes.data!.keyHash).toEqual(aliceKeyHash);
    expect(getKeyRes.data!.keyAlias).toEqual('update-alice-key');
  });

  test('delete key with invalid authorization', async () => {
    const res = await api.deleteKey({
      agent,
      body: {
        keyHash: aliceKeyHash,
      },
      authorization: 'sk-invalid',
    });

    expect(res.status).toEqual(401);
    expect(res.error).toBeTruthy();
    expect(res.error!.message).toEqual('Invalid authorization token');
  });

  test('delete key owned by other users', async () => {
    const res = await api.deleteKey({
      agent,
      body: {
        keyHash: aliceKeyHash,
      },
      authorization: bob.supabaseAuthorization,
    });

    expect(res.status).toEqual(403);
    expect(res.error).toBeTruthy();
    expect(res.error!.message).toMatch(
      'No permission to access the key that is owned by other users',
    );
  });

  test('delete key', async () => {
    const deleteKeyRes = await api.deleteKey({
      agent,
      body: {
        keyHash: aliceKeyHash,
      },
      authorization: alice.supabaseAuthorization,
    });

    expect(deleteKeyRes.status).toEqual(204);

    const getKeyRes = await api.getKey({
      agent,
      query: {
        keyHash: aliceKeyHash,
      },
      authorization: alice.supabaseAuthorization,
    });

    expect(getKeyRes.status).toEqual(200);
    expect(getKeyRes.data).toBeNull();

    const listKeysRes = await api.listKeys({
      agent,
      authorization: alice.supabaseAuthorization,
    });

    expect(listKeysRes.status).toEqual(200);
    expect(listKeysRes.data).toBeTruthy();
    expect(listKeysRes.data!.keys.length).toEqual(0);
  });
});
