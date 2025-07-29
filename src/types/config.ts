export type Config = {
  supabase: {
    endpointUrl: string;
    publishableKey: string;
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
