import { PrismaClient } from '../../.prisma';
import { config } from '../config';
import { litellmDecryptValue } from '../utils/crypto';

export const litellmDatabase = new PrismaClient({
  datasourceUrl: config.litellm.dbUrl,
});

export async function getInternalModelMetadata(modelName: string): Promise<{
  model: string;
  apiUrl: string;
  apiKey: string;
} | null> {
  const litellmParamsRaw = await litellmDatabase.$queryRaw<
    {
      litellm_params: {
        model: string;
        api_base?: string;
        api_key?: string;
        litellm_credential_name?: string;
      };
    }[]
  >`
    select litellm_params from "LiteLLM_ProxyModelTable" where model_name = ${modelName}
  `;

  if (litellmParamsRaw.length === 0) {
    return null;
  }

  const litellmParams = litellmParamsRaw[0].litellm_params;

  const model = litellmDecryptValue(litellmParams.model);

  if (litellmParams.api_base && litellmParams.api_key) {
    const apiUrl = litellmDecryptValue(litellmParams.api_base);
    const apiKey = litellmDecryptValue(litellmParams.api_key);
    return {
      model,
      apiUrl,
      apiKey,
    };
  } else if (litellmParams.litellm_credential_name) {
    const credentialName = litellmDecryptValue(
      litellmParams.litellm_credential_name,
    );
    const metadata =
      await getInternalModelMetadataByCredentialName(credentialName);

    if (!metadata) {
      throw Error(
        `Credential (${litellmParams.litellm_credential_name}) model metadata not found`,
      );
    }

    return {
      model,
      apiUrl: metadata.apiUrl,
      apiKey: metadata.apiKey,
    };
  } else {
    throw Error(`No enough params found in 'litellm_params'`);
  }
}

async function getInternalModelMetadataByCredentialName(
  credentialName: string,
): Promise<{
  apiUrl: string;
  apiKey: string;
} | null> {
  const credentialValuesRaw = await litellmDatabase.$queryRaw<
    {
      credential_values: {
        api_base: string;
        api_key: string;
      };
    }[]
  >`
    select credential_values from "LiteLLM_CredentialsTable" where credential_name = ${credentialName}
  `;

  if (credentialValuesRaw.length === 0) {
    return null;
  }

  const credentialValues = credentialValuesRaw[0].credential_values;

  return {
    apiUrl: litellmDecryptValue(credentialValues.api_base),
    apiKey: litellmDecryptValue(credentialValues.api_key),
  };
}
