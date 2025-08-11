import { Config } from '../types/config';
import { ENV } from '../utils/envs';

export async function getConfig(): Promise<Config> {
  const module = await import(`./${ENV}.ts`);
  return module.default;
}
