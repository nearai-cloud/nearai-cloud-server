import { RequestHandler } from 'express';
import { throwHttpError } from '../../utils/error';
import { STATUS_CODES } from '../../utils/consts';

export const notFound: RequestHandler = () => {
  throwHttpError({
    status: STATUS_CODES.NOT_FOUND,
  });
};
