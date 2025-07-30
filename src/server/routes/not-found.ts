import { RequestHandler } from 'express';
import { throwHttpError } from '../../utils/error';

export const notFound: RequestHandler = () => {
  throwHttpError({
    status: 404,
  });
};
