export const SLACK_ALERT_TAG = 'nearai-cloud-server';

export const BEARER_TOKEN_PREFIX = 'Bearer ';

export const INPUT_LIMITS = {
  KEY_ALIAS_MAX_LENGTH: 256,
  MIN_PAGE: 1,
  MIN_PAGE_SIZE: 1,
  MAX_PAGE_SIZE: 100,
} as const;

export const STATUS_CODES = {
  OK: 200,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export const CTX_GLOBAL_KEYS = {
  PRE_AUTH: 'global:weak-auth',
  AUTH: 'global:auth',
  INPUT: {
    PARAMS: 'global:params-input',
    QUERY: 'global:query-input',
    BODY: 'global:body-input',
  },
} as const;
