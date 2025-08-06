import { ApiClient, ApiClientOptions } from '../utils/api-client';

export class PrivatellmApiClient extends ApiClient {
  constructor(options: ApiClientOptions) {
    super(options);
  }

  async attestationReport(model: string) {
    return this.get({
      path: '/attestation/report',
      query: {
        model,
      },
    });
  }

  async signature(model: string, chatId: string, signingAlgo: string) {
    return this.get({
      path: `/signature/${chatId}`,
      query: {
        model,
        signing_algo: signingAlgo,
      },
    });
  }
}
