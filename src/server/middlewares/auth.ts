import { RequestHandler } from 'express';
import { User as SupabaseUser } from '@supabase/supabase-js';
import ctx from 'express-http-context';
import {
  BEARER_TOKEN_PREFIX,
  CTX_GLOBAL_KEYS,
  STATUS_CODES,
} from '../../utils/consts';
import { createSupabaseClient } from '../../services/supabase';
import { throwHttpError } from '../../utils/error';
import {
  adminLitellmApiClient,
  createLitellmApiClient,
  LitellmApiClient,
} from '../../services/litellm-api-client';
import { Key, User } from '../../types/litellm-api-client';

export type SupabaseAuth = {
  supabaseUser: SupabaseUser;
};

export type Auth = {
  supabaseUser: SupabaseUser;
  user: User;
};

export type KeyAuth = {
  key: Key;
  litellmClient: LitellmApiClient;
};

export const supabaseAuthMiddleware: RequestHandler = async (
  req,
  res,
  next,
) => {
  const supabaseAuth = await authorizeSupabase(req.headers.authorization);
  ctx.set(CTX_GLOBAL_KEYS.SUPABASE_AUTH, supabaseAuth);
  next();
};

export const authMiddleware: RequestHandler = async (req, res, next) => {
  const { supabaseUser } = await authorizeSupabase(req.headers.authorization);

  const user = await adminLitellmApiClient.getUser({
    userId: supabaseUser.id,
  });

  if (!user) {
    throwHttpError({
      status: STATUS_CODES.FORBIDDEN,
      message: 'Incomplete user registration',
    });
  }

  const auth: Auth = {
    supabaseUser,
    user,
  };

  ctx.set(CTX_GLOBAL_KEYS.AUTH, auth);

  next();
};

export const keyAuthMiddleware: RequestHandler = async (req, res, next) => {
  const keyAuth = await authorizeKey(req.headers.authorization);
  ctx.set(CTX_GLOBAL_KEYS.KEY_AUTH, keyAuth);
  next();
};

export const litellmServiceAccountAuthMiddleware: RequestHandler = async (
  req,
  res,
  next,
) => {
  await authorizeLitellmServiceAccount(req.headers.authorization);
  next();
};

async function authorizeSupabase(
  authorization?: string,
): Promise<SupabaseAuth> {
  if (!authorization) {
    throw throwHttpError({
      status: STATUS_CODES.UNAUTHORIZED,
      message: 'Missing authorization token',
    });
  }

  if (!authorization.startsWith(BEARER_TOKEN_PREFIX)) {
    throwHttpError({
      status: STATUS_CODES.UNAUTHORIZED,
      message: `Authorization token must start with '${BEARER_TOKEN_PREFIX}'`,
    });
  }

  const token = authorization.slice(BEARER_TOKEN_PREFIX.length);

  const client = createSupabaseClient();

  const {
    data: { user: supabaseUser },
    error,
  } = await client.auth.getUser(token);

  if (error) {
    throwHttpError({
      status: STATUS_CODES.UNAUTHORIZED,
      message: 'Failed to authorize', // Override with simple error message
      cause: error,
    });
  }

  if (!supabaseUser) {
    throwHttpError({
      status: STATUS_CODES.UNAUTHORIZED,
      message: 'Invalid authorization token',
    });
  }

  return {
    supabaseUser,
  };
}

async function authorizeKey(authorization?: string): Promise<KeyAuth> {
  if (!authorization) {
    throw throwHttpError({
      status: STATUS_CODES.UNAUTHORIZED,
      message: 'Missing authorization token',
    });
  }

  if (!authorization.startsWith(BEARER_TOKEN_PREFIX)) {
    throwHttpError({
      status: STATUS_CODES.UNAUTHORIZED,
      message: `Authorization token must start with '${BEARER_TOKEN_PREFIX}'`,
    });
  }

  const token = authorization.slice(BEARER_TOKEN_PREFIX.length);

  const litellmClient = createLitellmApiClient(token);

  let key: Key | null;

  try {
    key = await litellmClient.getKey({ keyOrKeyHash: token });
  } catch (e: unknown) {
    throwHttpError({
      status: STATUS_CODES.UNAUTHORIZED,
      message: 'Failed to authorize', // Override with simple error message
      cause: e,
    });
  }

  if (!key) {
    throwHttpError({
      status: STATUS_CODES.UNAUTHORIZED,
      message: 'Invalid authorization token',
    });
  }

  return {
    key,
    litellmClient,
  };
}

export async function authorizeLitellmServiceAccount(authorization?: string) {
  if (!authorization) {
    throwHttpError({
      status: STATUS_CODES.UNAUTHORIZED,
      message: 'Missing authorization token',
    });
  }

  if (!authorization.startsWith(BEARER_TOKEN_PREFIX)) {
    throwHttpError({
      status: STATUS_CODES.UNAUTHORIZED,
      message: `Authorization token must start with '${BEARER_TOKEN_PREFIX}'`,
    });
  }

  const token = authorization.slice(BEARER_TOKEN_PREFIX.length);

  const litellmClient = createLitellmApiClient(token);

  const key = await litellmClient.getKey({
    keyOrKeyHash: token,
  });

  if (!key) {
    throwHttpError({
      status: STATUS_CODES.UNAUTHORIZED,
      message: 'Invalid authorization token',
    });
  }

  if (!key.metadata.service_account_id) {
    throwHttpError({
      status: STATUS_CODES.FORBIDDEN,
      message: 'Only service account can access this endpoint',
    });
  }

  if (key.blocked) {
    throwHttpError({
      status: STATUS_CODES.FORBIDDEN,
      message: 'Service account is blocked',
    });
  }
}
