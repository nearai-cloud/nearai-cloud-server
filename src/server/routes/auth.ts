import { RequestHandler } from 'express';
import createHttpError from 'http-errors';
import ctx from 'express-http-context';
import { AUTHORIZATION_BEARER } from '../../utils/consts';
import { createSupabaseClient } from '../../services/supabase';

export const supabaseAuth: RequestHandler = async (req, res, next) => {
  const authorization = req.headers['authorization'];

  if (!authorization) {
    throw createHttpError(401);
  }

  if (!authorization.startsWith(AUTHORIZATION_BEARER)) {
    throw createHttpError(
      401,
      `Invalid authorization token. Must start with '${AUTHORIZATION_BEARER}'`,
    );
  }

  const token = authorization.slice(AUTHORIZATION_BEARER.length);

  const client = createSupabaseClient();

  const {
    data: { user },
    error,
  } = await client.auth.getUser(token);

  if (error || !user) {
    throw createHttpError(401, 'Invalid authorization token');
  }

  ctx.set('user', user);

  next();
};
