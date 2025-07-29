import { Config } from '../types/config';
import { ENV } from '../utils/env';

const module = await import(`./${ENV}.ts`);

export const config: Config = module.default;
