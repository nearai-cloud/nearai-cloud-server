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
import { litellm } from '../../services/litellm';
import { User } from '../../types/litellm';

export type SupabaseAuth = {
  supabaseUser: SupabaseUser;
};

export type Auth = {
  supabaseUser: SupabaseUser;
  user: User;
};

export const supabaseAuthMiddleware: RequestHandler = async (
  req,
  res,
  next,
) => {
  const authUser = await authorizeSupabase(req.headers.authorization);

  const preAuth: SupabaseAuth = {
    supabaseUser: authUser,
  };

  ctx.set(CTX_GLOBAL_KEYS.PRE_AUTH, preAuth);

  next();
};

export const authMiddleware: RequestHandler = async (req, res, next) => {
  const authUser = await authorizeSupabase(req.headers.authorization);

  const user = await litellm.getUser({
    userId: authUser.id,
  });

  if (!user) {
    throwHttpError({
      status: STATUS_CODES.FORBIDDEN,
      message: 'Incomplete user registration',
    });
  }

  const auth: Auth = {
    supabaseUser: authUser,
    user,
  };

  ctx.set(CTX_GLOBAL_KEYS.AUTH, auth);

  next();
};

async function authorizeSupabase(
  authorization?: string,
): Promise<SupabaseUser> {
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
    data: { user },
    error,
  } = await client.auth.getUser(token);

  if (error) {
    throwHttpError({
      status: STATUS_CODES.UNAUTHORIZED,
      cause: error,
    });
  }

  if (!user) {
    throwHttpError({
      status: STATUS_CODES.UNAUTHORIZED,
      message: 'Invalid authorization token',
    });
  }

  return user;
}
