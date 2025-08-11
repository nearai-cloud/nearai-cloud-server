export type Config = {
  isDev?: boolean;
  supabase: {
    apiUrl: string;
    anonKey: string;
  };
  litellm: {
    apiUrl: string;
    adminKey: string;
    signingKey: string;
    databaseUrl: string;
  };
  nearAiCloud: {
    databaseUrl: string;
  };
  log: {
    level: 'debug' | 'info';
  };
  server: {
    port: number;
  };
  slack: {
    webhookUrl?: string;
  };
};
