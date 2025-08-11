import { PrismaClient } from '../../.prisma/nearai-cloud';
import { getConfig } from '../config';
import { Signature, SigningAlgo } from '../types/privatellm-api-client';

export class LitellmDatabaseClient {
  private client: PrismaClient;

  constructor(datasourceUrl: string) {
    this.client = new PrismaClient({
      datasourceUrl,
    });
  }

  async getSignature(
    chatId: string,
    signingAlgo: SigningAlgo,
  ): Promise<Signature | null> {
    const signature = await this.client.nearAI_MessageSignatures.findUnique({
      where: {
        chat_id_signing_algo: {
          chat_id: chatId,
          signing_algo: signingAlgo,
        },
      },
    });

    if (!signature) {
      return null;
    }

    return {
      text: signature.text,
      signature: signature.signature,
      signing_address: signature.signing_address,
      signing_algo: signature.signing_algo as SigningAlgo,
    };
  }

  async setSignature(
    modelId: string,
    chatId: string,
    model: string,
    signature: Signature,
  ) {
    await this.client.nearAI_MessageSignatures.create({
      data: {
        ...signature,
        model_id: modelId,
        chat_id: chatId,
        model,
      },
    });
  }
}

export async function createNearAiCloudDatabaseClient(
  datasourceUrl?: string,
): Promise<LitellmDatabaseClient> {
  const config = await getConfig();
  datasourceUrl = datasourceUrl ?? config.litellm.databaseUrl;
  return new LitellmDatabaseClient(datasourceUrl);
}
