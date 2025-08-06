import { ApiClient, ApiClientOptions } from '../utils/api-client';
import {
  AttestationReport,
  AttestationReportParams,
  Signature,
  SignatureParams,
} from '../types/privatellm-api-client';

export class PrivatellmApiClient extends ApiClient {
  constructor(options: ApiClientOptions) {
    super(options);
  }

  async attestationReport({
    model,
  }: AttestationReportParams): Promise<AttestationReport> {
    return this.get<
      AttestationReport,
      {
        model: string;
      }
    >({
      path: '/attestation/report',
      query: {
        model,
      },
    });
  }

  async signature({
    chat_id,
    model,
    signing_algo,
  }: SignatureParams): Promise<Signature> {
    return this.get<Signature, Omit<SignatureParams, 'chat_id'>>({
      path: `/signature/${chat_id}`,
      query: {
        model,
        signing_algo,
      },
    });
  }
}

export function createPrivatellmApiClient(
  apiKey: string,
  apiUrl: string,
): PrivatellmApiClient {
  return new PrivatellmApiClient({
    apiUrl,
    apiKey,
  });
}
