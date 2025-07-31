import { ErrorRequestHandler } from 'express';
import { HttpError, isHttpError } from 'http-errors';
import { throwHttpError } from '../../utils/error';
import { HTTP_STATUS_CODES } from '../../utils/consts';

export function httpError({
  isDev = true,
}: { isDev?: boolean } = {}): ErrorRequestHandler {
  return (
    e: unknown,
    /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
    req,
    /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
    res,
    /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
    next,
  ) => {
    if (isDev) {
      console.error(e);
    }

    if (isHttpError(e)) {
      throw e;
    }

    throwHttpError({
      status: HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
      cause: e,
    });
  };
}

export function respondHttpError({
  isDev = true,
}: { isDev?: boolean } = {}): ErrorRequestHandler {
  return (
    e: HttpError,
    req,
    res,
    /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
    next,
  ) => {
    const status = e.status;

    res.status(status).json({
      error: {
        status,
        message: isDev || status === 500 ? e.message : 'Internal Server Error',
        stack: isDev ? e.stack : undefined,
      },
    });
  };
}
