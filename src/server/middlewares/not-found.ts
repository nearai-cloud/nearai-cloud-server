import { RequestHandler } from 'express';
import { throwHttpError } from '../../utils/error';
import { HTTP_STATUS_CODES } from '../../utils/consts';

export const notFound: RequestHandler = () => {
  throwHttpError({
    status: HTTP_STATUS_CODES.NOT_FOUND,
  });
};
