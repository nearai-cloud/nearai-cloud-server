import { ErrorRequestHandler, RequestHandler } from 'express';
import createHttpError, { HttpError } from 'http-errors';
import morgan from 'morgan';

morgan.token('timestamp', () => {
  const now = new Date();
  const date = now.toISOString().split('T')[0];
  const time = now.toISOString().split('T')[1].replace('Z', '');
  return `${date} ${time}`;
});

export const loggerMiddlewares = {
  preLog: (): RequestHandler => {
    return morgan(`[:timestamp] <-- :method :url`, {
      immediate: true,
    });
  },
  postLog: (): RequestHandler => {
    return morgan('[:timestamp] --> :method :url :status :response-time ms');
  },
};

export const errorMiddlewares = {
  createError: (): ErrorRequestHandler => {
    return (e, req, res, next) => {
      next(createHttpError(e));
    };
  },
  formatError: ({ isDev }: { isDev: boolean }): ErrorRequestHandler => {
    return (e: HttpError, req, res, next) => {
      console.error(e);

      const status = e.status;
      const message =
        isDev || status === 500 ? e.message : 'Internal Server Error';
      const stack = isDev ? e.stack : undefined;

      res.status(status).json({
        error: {
          message,
          stack,
        },
      });

      next();
    };
  },
};
