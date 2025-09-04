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

  beforeAll(async () => {
    agent = await setup();
  });

  afterAll(async () => {
    await tearDown();
  });

  test('generate key with invalid authorization', async () => {
    const res = await api.generateKey({
      agent,
      body: {
        keyAlias: 'alice-key',
      },
      authorization: 'invalid-token',
    });

    expect(res.status).toEqual(401);
    expect(res.error).toBeTruthy();
    expect(res.error!.message).toMatch('Invalid authorization token');
  });

  test('register user for generating key', async () => {
    const res = await api.registerUser({
      agent,
      authorization: alice.supabaseAuthorization,
    });

    expect(res.status).toEqual(204);
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
      authorization: 'invalid-token',
    });

    expect(res.status).toEqual(403);
    expect(res.error).toBeTruthy();
    expect(res.error!.message).toMatch('Only admin can access this endpoint');
  });

  test('generate service account', async () => {
    const res = await api.generateServiceAccount({
      agent,
      body: {
        serviceAccountId: 'test',
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
      authorization: 'invalid-token',
    });

    expect(res.status).toEqual(401);
    expect(res.error).toBeTruthy();
    expect(res.error!.message).toMatch('Invalid authorization token');
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
      authorization: 'invalid token',
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
      authorization: 'invalid token',
    });

    expect(res.status).toEqual(401);
    expect(res.error).toBeTruthy();
    expect(res.error!.message).toEqual('Invalid authorization token');
  });

  test('update key', async () => {
    const res = await api.updateKey({
      agent,
      body: {
        keyHash: aliceKeyHash,
        keyAlias: 'updated-alice-key',
      },
      authorization: alice.supabaseAuthorization,
    });

    expect(res.status).toEqual(204);
  });

  test('get key after updating', async () => {
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
    expect(res.data!.keyAlias).toEqual('updated-alice-key');
  });

  test('delete key with invalid authorization', async () => {
    const res = await api.deleteKey({
      agent,
      body: {
        keyHash: aliceKeyHash,
      },
      authorization: 'invalid token',
    });

    expect(res.status).toEqual(401);
    expect(res.error).toBeTruthy();
    expect(res.error!.message).toEqual('Invalid authorization token');
  });

  test('delete key', async () => {
    const res = await api.deleteKey({
      agent,
      body: {
        keyHash: aliceKeyHash,
      },
      authorization: alice.supabaseAuthorization,
    });

    expect(res.status).toEqual(204);
  });

  test('get key after deletion', async () => {
    const res = await api.getKey({
      agent,
      query: {
        keyHash: aliceKeyHash,
      },
      authorization: alice.supabaseAuthorization,
    });

    expect(res.status).toEqual(200);
    expect(res.data).toBeNull();
  });

  test('list keys after deletion', async () => {
    const res = await api.listKeys({
      agent,
      authorization: alice.supabaseAuthorization,
    });

    expect(res.status).toEqual(200);
    expect(res.data).toBeTruthy();
    expect(res.data!.keys.length).toEqual(0);
  });
});
