import { PrismaClient } from '../../.prisma/generated/nearai-cloud';
import { config } from '../config';
import { Signature, SigningAlgo } from '../types/privatellm-api-client';

export class NearAiCloudDatabaseClient {
  private client: PrismaClient;

  constructor(datasourceUrl: string) {
    this.client = new PrismaClient({
      datasourceUrl,
    });
  }

  async getSignature(
    modelId: string,
    chatId: string,
    signingAlgo: SigningAlgo,
  ): Promise<Signature | null> {
    const signature = await this.client.nearAi_MessageSignatures.findUnique({
      where: {
        model_id_chat_id_signing_algo: {
          model_id: modelId,
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
    await this.client.nearAi_MessageSignatures.create({
      data: {
        ...signature,
        model_id: modelId,
        chat_id: chatId,
        model,
      },
    });
  }
}

export function createNearAiCloudDatabaseClient(
  datasourceUrl = config.nearAiCloud.databaseUrl,
): NearAiCloudDatabaseClient {
  return new NearAiCloudDatabaseClient(datasourceUrl);
}

export const nearAiCloudDatabaseClient = createNearAiCloudDatabaseClient();
