import * as api from '../utils/api';
import { setup, tearDown } from '../utils/setup';
import { LITELLM_MASTER_KEY } from '../utils/consts';
import { mockUsers } from '../utils/users';
import { SetupContext } from '../types/context';
import { sleep } from '../utils/common';

type Context = SetupContext & {
  serviceAccount?: string;
  aliceKey?: string;
  chatId?: string;
};

const ENV_TEST_CREDENTIAL_API_KEY = process.env.TEST_CREDENTIAL_API_KEY;

if (!ENV_TEST_CREDENTIAL_API_KEY) {
  describe = describe.skip;
}

describe('openai api', () => {
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
        serviceAccountId: 'test-openai-api',
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
        credentialName: 'Redpill',
        providerApiUrl: 'https://api.redpill.ai/v1',
        providerApiKey: ENV_TEST_CREDENTIAL_API_KEY!,
      },
      authorization: ctx.serviceAccount,
    });

    expect(res.status).toEqual(204);
  });

  test('create model', async () => {
    const res = await api.createModel({
      agent: ctx.agent,
      body: {
        credentialName: 'Redpill',
        model: 'gpt-oss-120b',
        providerName: 'openai',
        providerModelName: 'phala/gpt-oss-120b',
        metadata: {
          verifiable: true,
          contextLength: 100_000,
          modelFullName: 'GPT OSS 120B',
          modelDescription:
            'gpt-oss-120b is an open-weight, 117B-parameter Mixture-of-Experts (MoE) language model from OpenAI designed for high-reasoning, agentic, and general-purpose production use cases. It activates 5.1B parameters per forward pass and is optimized to run on a single H100 GPU with native MXFP4 quantization. The model supports configurable reasoning depth, full chain-of-thought access, and native tool use, including function calling, browsing, and structured output generation.',
          modelIcon:
            'https://avatars.githubusercontent.com/u/14957082?s=200&v=4',
        },
      },
      authorization: ctx.serviceAccount,
    });

    expect(res.status).toEqual(200);
    expect(res.data).toBeTruthy();
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

    ctx.aliceKey = res.data!.key;
  });

  test('POST /chat/completions', async () => {
    await sleep(10 * 1000); // Wait for model becoming available

    const res = await api.chatCompletions({
      agent: ctx.agent,
      body: {
        model: 'gpt-oss-120b',
        messages: [
          {
            role: 'user',
            content: 'Hello, what is the weather today?',
          },
        ],
      },
      authorization: ctx.aliceKey,
    });

    expect(res.status).toEqual(200);
    expect(res.data).toBeTruthy();
    expect(res.data!.object).toEqual('chat.completion');

    ctx.chatId = res.data!.id;
  });

  test('GET /models', async () => {
    const res = await api.models({
      agent: ctx.agent,
      authorization: ctx.aliceKey,
    });

    expect(res.status).toEqual(200);
    expect(res.data).toBeTruthy();
    expect(res.data!.object).toEqual('list');
  });

  test('GET /attestation/report', async () => {
    const res = await api.attestationReport({
      agent: ctx.agent,
      query: {
        model: 'gpt-oss-120b',
      },
      authorization: ctx.aliceKey,
    });

    expect(res.status).toEqual(200);
    expect(res.data).toBeTruthy();
    expect(res.data!.signing_address).toMatch(/^0x/);
  });

  test('GET /signatures/:chat_id', async () => {
    const res = await api.signature({
      agent: ctx.agent,
      params: {
        chatId: ctx.chatId!,
      },
      query: {
        model: 'gpt-oss-120b',
        signing_algo: 'ecdsa',
      },
      authorization: ctx.aliceKey,
    });

    expect(res.status).toEqual(200);
    expect(res.data).toBeTruthy();
    expect(res.data!.signing_address).toMatch(/^0x/);
  });
});
