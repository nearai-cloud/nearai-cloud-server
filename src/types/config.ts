export type Config = {
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
