import { RequestHandler } from 'express';
import { createHttpError } from '../../utils/error';
import { STATUS_CODES } from '../../utils/consts';

export const notFoundMiddleware: RequestHandler = () => {
  throw createHttpError({
    status: STATUS_CODES.NOT_FOUND,
  });
};
