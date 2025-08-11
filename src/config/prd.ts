import { Config } from '../types/config';
import {
  ENV_SERVER_PORT,
  ENV_SUPABASE_API_URL,
  ENV_SUPABASE_ANON_KEY,
  ENV_SLACK_WEBHOOK_URL,
  ENV_LITELLM_API_URL,
  ENV_LITELLM_ADMIN_KEY,
  ENV_LITELLM_DB_URL,
  ENV_LITELLM_SIGNING_KEY,
  ENV_NEAR_AI_CLOUD_DB_URL,
} from '../utils/envs';

const config: Config = {
  supabase: {
    apiUrl: ENV_SUPABASE_API_URL,
    anonKey: ENV_SUPABASE_ANON_KEY,
  },
  litellm: {
    apiUrl: ENV_LITELLM_API_URL,
    adminKey: ENV_LITELLM_ADMIN_KEY,
    databaseUrl: ENV_LITELLM_DB_URL,
    signingKey: ENV_LITELLM_SIGNING_KEY,
  },
  nearAiCloud: {
    databaseUrl: ENV_NEAR_AI_CLOUD_DB_URL,
  },
  log: {
    level: 'info',
  },
  server: {
    port: ENV_SERVER_PORT,
  },
  slack: {
    webhookUrl: ENV_SLACK_WEBHOOK_URL,
  },
};

export default config;
