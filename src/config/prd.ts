import { Config } from '../types/config';
import {
  ENV_SERVER_PORT,
  ENV_SUPABASE_URL,
  ENV_SUPABASE_KEY,
  ENV_SLACK_WEBHOOK_URL,
  ENV_LIGHT_LLM_API_URL,
  ENV_LIGHT_LLM_ADMIN_KEY,
} from '../utils/envs';

const config: Config = {
  supabase: {
    apiUrl: ENV_SUPABASE_URL,
    publishableKey: ENV_SUPABASE_KEY,
  },
  lightLLM: {
    apiUrl: ENV_LIGHT_LLM_API_URL,
    adminKey: ENV_LIGHT_LLM_ADMIN_KEY,
  },
  log: {
    level: 'debug',
    color: false,
  },
  server: {
    port: ENV_SERVER_PORT,
    respondErrorDetails: false,
  },
  slack: {
    webhookUrl: ENV_SLACK_WEBHOOK_URL,
  },
};

export default config;
