import { RequestHandler } from 'express';
import ctx from 'express-http-context';
import { AUTHORIZATION_BEARER } from '../../utils/consts';
import { createSupabaseClient } from '../../services/supabase';
import { throwHttpError } from '../../utils/error';

export const sessionAuth: RequestHandler = async (req, res, next) => {
  const authorization = req.headers['authorization'];

  if (!authorization) {
    throw throwHttpError({
      status: 401,
    });
  }

  if (!authorization.startsWith(AUTHORIZATION_BEARER)) {
    throwHttpError({
      status: 401,
      message: `Invalid authorization token. Must start with '${AUTHORIZATION_BEARER}'`,
    });
  }

  const token = authorization.slice(AUTHORIZATION_BEARER.length);

  const client = createSupabaseClient();

  const {
    data: { user },
    error,
  } = await client.auth.getUser(token);

  if (error || !user) {
    throwHttpError({
      status: 401,
      message: 'Invalid authorization token',
    });
  }

  ctx.set('user', user);

  next();
};
