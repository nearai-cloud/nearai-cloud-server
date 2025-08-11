import { SupabaseClient, createClient } from '@supabase/supabase-js';
import { getConfig } from '../config';

export async function createSupabaseClient(): Promise<SupabaseClient> {
  const config = await getConfig();
  return createClient(config.supabase.apiUrl, config.supabase.anonKey);
}
