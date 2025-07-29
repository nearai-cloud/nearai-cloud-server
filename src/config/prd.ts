import { Config } from '../types/config';
import {
  ENV_SERVER_PORT,
  ENV_SUPABASE_URL,
  ENV_SUPABASE_KEY,
  ENV_SLACK_WEBHOOK_URL,
} from '../utils/envs';

const config: Config = {
  supabase: {
    endpointUrl: ENV_SUPABASE_URL,
    anonymousKey: ENV_SUPABASE_KEY,
  },
  logger: {
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
