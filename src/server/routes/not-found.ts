import { RequestHandler } from 'express';
import createHttpError from 'http-errors';

export const notFound: RequestHandler = () => {
  throw createHttpError(404, 'Not Found');
};
