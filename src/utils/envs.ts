export const ENV = requiredEnv('ENV');

export const ENV_SUPABASE_API_URL = requiredEnv('SUPABASE_API_URL');
export const ENV_SUPABASE_ANON_KEY = requiredEnv('SUPABASE_ANON_KEY');

export const ENV_LITELLM_API_URL = requiredEnv('LITELLM_API_URL');
export const ENV_LITELLM_ADMIN_KEY = requiredEnv('LITELLM_ADMIN_KEY');
export const ENV_LITELLM_SIGNING_KEY = requiredEnv('LITELLM_SIGNING_KEY');

export const ENV_SERVER_PORT = requiredEnv('PORT', 'number');

export const ENV_ENABLE_CACHE_CLEANER = optionalEnv(
  'ENABLE_CACHE_CLEANER',
  'boolean',
);

export const ENV_SLACK_WEBHOOK_URL = optionalEnv('SLACK_WEBHOOK_URL');

// ------------------------------- Helper  -------------------------------------------

function requiredEnv(name: string): string;
function requiredEnv(name: string, convert: 'number'): number;
function requiredEnv(name: string, convert: 'boolean'): boolean;
function requiredEnv(
  name: string,
  convert?: 'number' | 'boolean',
): string | number | boolean;
function requiredEnv(
  name: string,
  convert?: 'number' | 'boolean',
): string | number | boolean {
  const value = optionalEnv(name, convert);

  if (value === undefined) {
    throw Error(`Missing env: ${name}`);
  }

  return value;
}

function optionalEnv(name: string): string | undefined;
function optionalEnv(name: string, convert: 'number'): number | undefined;
function optionalEnv(name: string, convert: 'boolean'): boolean | undefined;
function optionalEnv(
  name: string,
  convert?: 'number' | 'boolean',
): string | number | boolean | undefined;
function optionalEnv(
  name: string,
  convert?: 'number' | 'boolean',
): string | number | boolean | undefined {
  const value = process.env[name];

  if (value === undefined) {
    return undefined;
  }

  if (convert === 'number') {
    return Number(value);
  } else if (convert === 'boolean') {
    return value === 'true';
  } else {
    return value;
  }
}
