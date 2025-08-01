export const SLACK_ALERT_TAG = 'nearai-cloud-server';

export const BEARER_TOKEN_PREFIX = 'Bearer ';

export const INPUT_LIMITS = {
  KEY_ALIAS_MAX_LENGTH: 256,
} as const;

export const STATUS_CODES = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
} as const;

export const CTX_GLOBAL_KEYS = {
  WEAK_AUTH: 'global:weak-auth',
  AUTH: 'global:auth',
  PARAMS_INPUT: 'global:params-input',
  QUERY_INPUT: 'global:query-input',
  BODY_INPUT: 'global:body-input',
} as const;
