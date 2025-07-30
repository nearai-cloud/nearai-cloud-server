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
    publishableKey: ENV_SUPABASE_KEY,
  },
  log: {
    level: 'debug',
    color: true,
  },
  server: {
    port: ENV_SERVER_PORT,
    respondErrorDetails: true,
  },
  slack: {
    webhookUrl: ENV_SLACK_WEBHOOK_URL,
  },
};

export default config;
