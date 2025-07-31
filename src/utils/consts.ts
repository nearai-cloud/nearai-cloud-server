export const SLACK_ALERT_TAG = 'nearai-cloud-server';

export const AUTHORIZATION_BEARER = 'Bearer ';

export const INPUT_LIMITS = {
  KEY_ALIAS_MAX_LENGTH: 256,
} as const;

export const HTTP_STATUS_CODES = {
  OK: 200,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export const CTX_KEYS = {
  WEAK_AUTH: 'ctx:weak-auth',
  AUTH: 'ctx:auth',
  INPUT: 'ctx:input',
} as const;
