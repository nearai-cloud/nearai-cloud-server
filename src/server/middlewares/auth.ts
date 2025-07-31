import { RequestHandler, Request } from 'express';
import { User as SupabaseUser } from '@supabase/supabase-js';
import ctx from 'express-http-context';
import {
  BEARER_TOKEN_PREFIX,
  CONTEXT_KEYS,
  STATUS_CODES,
} from '../../utils/consts';
import { createSupabaseClient } from '../../services/supabase';
import { throwHttpError } from '../../utils/error';
import { lightLLM } from '../../services/light-llm';
import { User } from '../../types/light-llm';

export type AuthUser = SupabaseUser;

export type WeakAuth = {
  authUser: AuthUser;
};

export type Auth = {
  authUser: AuthUser;
  user: User;
};

export const weakAuth: RequestHandler = async (req, res, next) => {
  const authUser = await authorize(req);

  const weakAuth: WeakAuth = {
    authUser,
  };

  ctx.set(CONTEXT_KEYS.WEAK_AUTH, weakAuth);

  next();
};

export const auth: RequestHandler = async (req, res, next) => {
  const authUser = await authorize(req);

  const user = await lightLLM.getUser(authUser.id);

  if (!user) {
    throwHttpError({
      status: STATUS_CODES.FORBIDDEN,
      message: 'Incomplete user registration',
    });
  }

  const auth: Auth = {
    authUser,
    user,
  };

  ctx.set(CONTEXT_KEYS.AUTH, auth);

  next();
};

async function authorize(req: Request): Promise<AuthUser> {
  const authorization = req.headers['authorization'];

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
