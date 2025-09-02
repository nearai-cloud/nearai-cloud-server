import { Agent } from 'supertest';
import { mockUsers } from '../utils/users';
import * as api from '../utils/api';
import { setup, tearDown } from '../utils/setup';
import { createHash } from 'crypto';

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
      input: {
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
      input: {
        keyAlias: 'alice-key',
      },
      authorization: alice.supabaseAuthorization,
    });

    expect(res.status).toEqual(200);
    expect(res.output).toBeTruthy();

    aliceKey = res.output!.key;
    aliceKeyHash = createHash('sha256')
      .update(aliceKey)
      .digest()
      .toString('hex');
  });

  test('get key with invalid authorization', async () => {
    const res = await api.getKey({
      agent,
      input: {
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
      input: {
        keyHash: aliceKeyHash,
      },
      authorization: alice.supabaseAuthorization,
    });

    expect(res.status).toEqual(200);
    expect(res.output).toBeTruthy();
    expect(res.output!.keyHash).toEqual(aliceKeyHash);
  });

  test('generate service account key for listing users with invalid authorization', async () => {
    const res = await api.generateServiceAccount({
      agent,
      input: {
        serviceAccountId: 'list-user',
      },
      authorization: 'invalid-token',
    });

    expect(res.status).toEqual(403);
    expect(res.error).toBeTruthy();
    expect(res.error!.message).toMatch('Only admin can access this endpoint');
  });
});
