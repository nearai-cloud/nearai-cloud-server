import * as api from '../utils/api';
import { setup, tearDown } from '../utils/setup';
import { LITELLM_MASTER_KEY } from '../utils/consts';
import { SetupContext } from '../types/context';
import { sleep } from '../utils/common';

type Context = SetupContext & {
  serviceAccount?: string;
};

describe('credential api', () => {
  let ctx: Context;

  beforeAll(async () => {
    ctx = await setup();
  });

  afterAll(async () => {
    await tearDown();
  });

  test('generate service account', async () => {
    const res = await api.generateServiceAccount({
      agent: ctx.agent,
      body: {
        serviceAccountId: 'test-credential-api',
      },
      authorization: LITELLM_MASTER_KEY,
    });

    expect(res.status).toEqual(200);
    expect(res.data).toBeTruthy();

    ctx.serviceAccount = res.data!.key;
  });

  test('create credential with invalid authorization', async () => {
    const res = await api.createCredential({
      agent: ctx.agent,
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
      agent: ctx.agent,
      body: {
        credentialName: 'OpenAI',
        providerApiUrl: 'https://api.openai.com/v1',
        providerApiKey: 'sk-example',
      },
      authorization: ctx.serviceAccount,
    });

    expect(res.status).toEqual(204);
  });

  test('list credentials with invalid authorization', async () => {
    const res = await api.listCredentials({
      agent: ctx.agent,
      authorization: 'sk-invalid',
    });

    expect(res.status).toEqual(401);
    expect(res.error).toBeTruthy();
    expect(res.error!.message).toMatch('Invalid authorization token');
  });

  test('list credentials', async () => {
    const res = await api.listCredentials({
      agent: ctx.agent,
      authorization: ctx.serviceAccount,
    });

    expect(res.status).toEqual(200);
    expect(res.data).toBeTruthy();
    expect(res.data!.length).toEqual(1);
  });

  test('update credential with invalid authorization', async () => {
    const res = await api.updateCredential({
      agent: ctx.agent,
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
      agent: ctx.agent,
      body: {
        credentialName: 'OpenAI',
        providerApiUrl: 'https://api.openai.com/v2',
      },
      authorization: ctx.serviceAccount,
    });

    expect(updateCredentialRes.status).toEqual(204);

    await sleep(10 * 1000); // Wait for cache expires

    const listCredentialsRes = await api.listCredentials({
      agent: ctx.agent,
      authorization: ctx.serviceAccount,
    });

    expect(listCredentialsRes.status).toEqual(200);
    expect(listCredentialsRes.data).toBeTruthy();
    expect(listCredentialsRes.data![0].providerApiUrl).toEqual(
      'https://api.openai.com/v2',
    );
  });
});
