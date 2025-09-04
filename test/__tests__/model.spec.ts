import * as api from '../utils/api';
import { setup, tearDown } from '../utils/setup';
import { LITELLM_MASTER_KEY } from '../utils/consts';
import { mockUsers } from '../utils/users';
import { SetupContext } from '../types/context';

type Context = SetupContext & {
  serviceAccount?: string;
};

describe('model api', () => {
  let ctx: Context;

  beforeAll(async () => {
    ctx = await setup();
  });

  afterAll(async () => {
    await tearDown();
  });

  test('generate service account', async () => {
    const generateServiceAccountRes = await api.generateServiceAccount({
      agent: ctx.agent,
      body: {
        serviceAccountId: 'test-model-api',
      },
      authorization: LITELLM_MASTER_KEY,
    });

    expect(generateServiceAccountRes.status).toEqual(200);
    expect(generateServiceAccountRes.data).toBeTruthy();

    ctx.serviceAccount = generateServiceAccountRes.data!.key;
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

  test('create model with invalid authorization', async () => {
    const res = await api.createModel({
      agent: ctx.agent,
      body: {
        credentialName: 'OpenAI',
        model: 'gpt-3.5',
        providerName: 'openai',
        providerModelName: 'openai/gpt-3.5',
        metadata: {
          verifiable: true,
          contextLength: 10_000,
          modelFullName: 'GPT 3.5',
          modelDescription: 'I am description',
          modelIcon: 'I am icon',
        },
      },
      authorization: 'sk-invalid',
    });

    expect(res.status).toEqual(401);
    expect(res.error).toBeTruthy();
    expect(res.error!.message).toMatch('Invalid authorization token');
  });

  test('create model', async () => {
    const res = await api.createModel({
      agent: ctx.agent,
      body: {
        credentialName: 'OpenAI',
        model: 'gpt-3.5',
        providerName: 'openai',
        providerModelName: 'openai/gpt-3.5',
        metadata: {
          verifiable: true,
          contextLength: 10_000,
          modelFullName: 'GPT 3.5',
          modelDescription: 'I am description',
          modelIcon: 'I am icon',
        },
      },
      authorization: ctx.serviceAccount,
    });

    expect(res.status).toEqual(200);
    expect(res.data).toBeTruthy();
  });

  test('get model with invalid authorization', async () => {
    const res = await api.getModel({
      agent: ctx.agent,
      query: {
        model: 'gpt-3.5',
      },
      authorization: 'sk-invalid',
    });

    expect(res.status).toEqual(401);
    expect(res.error).toBeTruthy();
    expect(res.error!.message).toMatch('Invalid authorization token');
  });

  test('get model', async () => {
    const res = await api.getModel({
      agent: ctx.agent,
      query: {
        model: 'gpt-3.5',
      },
      authorization: mockUsers.alice.supabaseAuthorization,
    });

    expect(res.status).toEqual(200);
    expect(res.data).toBeTruthy();
    expect(res.data!.model).toEqual('gpt-3.5');
  });
});
