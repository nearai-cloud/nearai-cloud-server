import { Agent } from 'supertest';
import * as api from '../utils/api';
import { setup, tearDown } from '../utils/setup';
import { LITELLM_MASTER_KEY } from '../utils/docker';

describe('credential api', () => {
  let agent: Agent;

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
        serviceAccountId: 'test-credential-api',
      },
      authorization: LITELLM_MASTER_KEY,
    });

    expect(res.status).toEqual(200);
    expect(res.data).toBeTruthy();
    serviceAccount = res.data!.key;
  });

  test('create credential with invalid authorization', async () => {
    const res = await api.createCredential({
      agent,
      body: {
        credentialName: 'OpenAI',
        providerApiUrl: 'https://api.openai.com/v1',
        providerApiKey: 'sk-example',
      },
      authorization: 'sk-invalid',
    });

    expect(res.status).toEqual(401);
    expect(res.error).toBeTruthy();
    expect(res.error!.message).toMatch('Invalid authorization token');
  });

  test('create credential', async () => {
    const res = await api.createCredential({
      agent,
      body: {
        credentialName: 'OpenAI',
        providerApiUrl: 'https://api.openai.com/v1',
        providerApiKey: 'sk-example',
      },
      authorization: serviceAccount,
    });

    expect(res.status).toEqual(204);
  });

  test('list credentials with invalid authorization', async () => {
    const res = await api.listCredentials({
      agent,
      authorization: 'sk-invalid',
    });

    expect(res.status).toEqual(401);
    expect(res.error).toBeTruthy();
    expect(res.error!.message).toMatch('Invalid authorization token');
  });

  test('list credentials', async () => {
    const res = await api.listCredentials({
      agent,
      authorization: serviceAccount,
    });

    expect(res.status).toEqual(200);
    expect(res.data).toBeTruthy();
    expect(res.data!.length).toEqual(1);
  });

  test('update credential with invalid authorization', async () => {
    const res = await api.updateCredential({
      agent,
      body: {
        credentialName: 'OpenAI',
        providerApiUrl: 'https://api.openai.com/v2',
      },
      authorization: 'sk-invalid',
    });

    expect(res.status).toEqual(401);
    expect(res.error).toBeTruthy();
    expect(res.error!.message).toMatch('Invalid authorization token');
  });

  test('update credential', async () => {
    const updateCredentialRes = await api.updateCredential({
      agent,
      body: {
        credentialName: 'OpenAI',
        providerApiUrl: 'https://api.openai.com/v2',
      },
      authorization: serviceAccount,
    });

    expect(updateCredentialRes.status).toEqual(204);

    const listCredentialsRes = await api.listCredentials({
      agent,
      authorization: serviceAccount,
    });

    expect(listCredentialsRes.status).toEqual(200);
    expect(listCredentialsRes.data).toBeTruthy();
    expect(listCredentialsRes.data![0].providerApiUrl).toEqual(
      'https://api.openai.com/v2',
    );
  });
});
