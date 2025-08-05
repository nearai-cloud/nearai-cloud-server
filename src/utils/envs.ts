import { config } from 'dotenv';

export const ENV = requiredEnv('ENV');

config({
  path: ['.env', `.env.${ENV}`],
  override: true,
});

// ------------------------------- Load through dotenv -------------------------------

export const ENV_SUPABASE_API_URL = requiredEnv('SUPABASE_API_URL');
export const ENV_SUPABASE_ANON_KEY = requiredEnv('SUPABASE_ANON_KEY');

export const ENV_LITELLM_API_URL = requiredEnv('LITELLM_API_URL');
export const ENV_LITELLM_ADMIN_KEY = requiredEnv('LITELLM_ADMIN_KEY');

export const ENV_SERVER_PORT = Number(requiredEnv('PORT'));

export const ENV_SLACK_WEBHOOK_URL = optionalEnv('SLACK_WEBHOOK_URL');

// ------------------------------- Helper  -------------------------------------------

function requiredEnv(name: string): string {
  return (
    process.env[name] ||
    console.error('Error missing:', name) ||
    process.exit(1)
  );
}

function optionalEnv(name: string): string | undefined {
  return process.env[name];
}
