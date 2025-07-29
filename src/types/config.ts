export type Config = {
  supabase: {
    endpointUrl: string;
    anonymousKey: string;
  };
  logger: {
    level: 'debug' | 'info';
  };
  server: {
    port: number;
  };
  slack: {
    webhookUrl?: string;
  };
};
