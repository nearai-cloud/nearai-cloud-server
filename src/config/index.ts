import { Config } from '../types/config';
import { ENV } from '../utils/envs';
import devConfig from './dev';
import stgConfig from './stg';
import prdConfig from './prd';

function getConfig(): Config {
  switch (ENV) {
    case 'dev':
      return devConfig;
    case 'stg':
      return stgConfig;
    case 'prd':
      return prdConfig;
    default:
      throw new Error(`Unknown environment: ${ENV}`);
  }
}

export const config = getConfig();
