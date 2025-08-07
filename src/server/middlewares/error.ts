import { ErrorRequestHandler } from 'express';
import { isHttpError } from 'http-errors';
import { isOpenAiHttpError, createHttpError } from '../../utils/error';
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

    throw createHttpError({
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
    if (isOpenAiHttpError(e)) {
      res.status(e.status).json({
        error: {
          status: e.status,
          message:
            isDev || e.status !== STATUS_CODES.INTERNAL_SERVER_ERROR
              ? e.message
              : 'Internal Server Error',
          type: e.type,
          param: e.param,
          code: e.code,
          stack: isDev ? e.stack : undefined,
        },
      });
    } else if (isHttpError(e)) {
      res.status(e.status).json({
        error: {
          status: e.status,
          message:
            isDev || e.status !== STATUS_CODES.INTERNAL_SERVER_ERROR
              ? e.message
              : 'Internal Server Error',
          stack: isDev ? e.stack : undefined,
        },
      });
    } else if (e instanceof Error) {
      res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        error: {
          status: STATUS_CODES.INTERNAL_SERVER_ERROR,
          message: isDev ? e.message : 'Internal Server Error',
          stack: isDev ? e.stack : undefined,
        },
      });
    } else {
      res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        error: {
          status: STATUS_CODES.INTERNAL_SERVER_ERROR,
          message: 'Internal Server Error',
        },
      });
    }
  };
}
