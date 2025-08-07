import { ErrorRequestHandler } from 'express';
import { isHttpError } from 'http-errors';
import { throwHttpError } from '../../utils/error';
import { STATUS_CODES } from '../../utils/consts';

export function createHttpErrorMiddleware({
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
      status: STATUS_CODES.INTERNAL_SERVER_ERROR,
      cause: e,
    });
  };
}

export function createExposeErrorMiddleware({
  isDev = true,
}: { isDev?: boolean } = {}): ErrorRequestHandler {
  return (
    e: unknown,
    req,
    res,
    /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
    next,
  ) => {
    if (isHttpError(e)) {
      res.status(e.status).json({
        error: {
          message:
            isDev || e.status !== STATUS_CODES.INTERNAL_SERVER_ERROR
              ? e.message
              : 'Internal Server Error',
          type: 'error',
          param: null,
          code: e.status.toString(),
          status: e.status,
          stack: isDev ? e.stack : undefined,
        },
      });
    } else if (e instanceof Error) {
      res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        error: {
          message: isDev ? e.message : 'Internal Server Error',
          type: 'error',
          param: null,
          code: STATUS_CODES.INTERNAL_SERVER_ERROR.toString(),
          status: STATUS_CODES.INTERNAL_SERVER_ERROR,
          stack: isDev ? e.stack : undefined,
        },
      });
    } else {
      res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        error: {
          message: 'Internal Server Error',
          type: 'error',
          param: null,
          code: STATUS_CODES.INTERNAL_SERVER_ERROR.toString(),
          status: STATUS_CODES.INTERNAL_SERVER_ERROR,
        },
      });
    }
  };
}
