export type Config = {
  supabase: {
    endpointUrl: string;
    publishableKey: string;
  };
  log: {
    level: 'debug' | 'info';
    color: boolean;
  };
  server: {
    port: number;
    respondErrorDetails: boolean;
  };
  slack: {
    webhookUrl?: string;
  };
};
