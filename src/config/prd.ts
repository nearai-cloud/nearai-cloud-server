import { Config } from '../types/config';
import {
  ENV_SERVER_PORT,
  ENV_SUPABASE_API_URL,
  ENV_SUPABASE_ANON_KEY,
  ENV_SLACK_WEBHOOK_URL,
  ENV_LIGHT_LLM_API_URL,
  ENV_LIGHT_LLM_ADMIN_KEY,
} from '../utils/envs';

const config: Config = {
  supabase: {
    apiUrl: ENV_SUPABASE_API_URL,
    anonKey: ENV_SUPABASE_ANON_KEY,
  },
  lightLLM: {
    apiUrl: ENV_LIGHT_LLM_API_URL,
    adminKey: ENV_LIGHT_LLM_ADMIN_KEY,
  },
  log: {
    level: 'debug',
  },
  server: {
    port: ENV_SERVER_PORT,
  },
  slack: {
    webhookUrl: ENV_SLACK_WEBHOOK_URL,
  },
};

export default config;
