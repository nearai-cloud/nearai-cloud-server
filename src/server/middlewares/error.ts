import { ErrorRequestHandler } from 'express';
import createHttpError, { HttpError, UnknownError } from 'http-errors';

export function httpError(): ErrorRequestHandler {
  return (
    e: UnknownError,
    /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
    req,
    /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
    res,
    /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
    next,
  ) => {
    console.error(e);
    throw createHttpError(e);
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
