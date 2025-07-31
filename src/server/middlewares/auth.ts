import { RequestHandler } from 'express';
import ctx from 'express-http-context';
import {
  AUTHORIZATION_BEARER,
  CTX_KEYS,
  STATUS_CODES,
} from '../../utils/consts';
import { createSupabaseClient } from '../../services/supabase';
import { throwHttpError } from '../../utils/error';
import { User } from '@supabase/supabase-js';

export type Auth = {
  user: User;
};

export const auth: RequestHandler = async (req, res, next) => {
  const authorization = req.headers['authorization'];

  if (!authorization) {
    throw throwHttpError({
      status: STATUS_CODES.UNAUTHORIZED,
    });
  }

  if (!authorization.startsWith(AUTHORIZATION_BEARER)) {
    throwHttpError({
      status: STATUS_CODES.UNAUTHORIZED,
      message: `Authorization token must start with '${AUTHORIZATION_BEARER}'`,
    });
  }

  const token = authorization.slice(AUTHORIZATION_BEARER.length);

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

  ctx.set(CTX_KEYS.AUTH, {
    user,
  });

  next();
};
