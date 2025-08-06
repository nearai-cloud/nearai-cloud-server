import { Client, ClientOptions } from '../utils/Client';

export class PrivatellmClient extends Client {
  constructor(options: ClientOptions) {
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
