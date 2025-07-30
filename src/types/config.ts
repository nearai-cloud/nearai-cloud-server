export type Config = {
  isDev?: boolean;
  supabase: {
    apiUrl: string;
    anonKey: string;
  };
  lightLLM: {
    apiUrl: string;
    adminKey: string;
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
