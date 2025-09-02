export type Config = {
  isDev: boolean;
  supabase: {
    apiUrl: string;
    anonKey: string;
  };
  litellm: {
    apiUrl: string;
    adminKey: string;
    signingKey: string;
  };
  log: {
    level: 'debug' | 'info';
  };
  server: {
    port: number;
  };
  cache: {
    enableCleaner?: boolean;
  };
  slack: {
    webhookUrl?: string;
  };
};
