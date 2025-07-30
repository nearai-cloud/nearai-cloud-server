import { ErrorRequestHandler, RequestHandler } from 'express';
import createHttpError, { UnknownError, HttpError } from 'http-errors';
import morgan from 'morgan';
import dayjs from 'dayjs';
import { addColor, getHttpStatusColor } from '../utils/color';

export const logMiddlewares = {
  preLog: ({ isDev = true }: { isDev?: boolean } = {}): RequestHandler => {
    return morgan(
      (tokens, req, res) => {
        const timestamp = dayjs().format('YYYY-MM-DD HH:mm:ss.SSS');

        const method = tokens['method']?.(req, res);

        if (!method) {
          throw createHttpError(`Pre log token 'method' not found`);
        }

        const url = tokens['url']?.(req, res);

        if (!url) {
          throw createHttpError(`Pre log token 'url' not found`);
        }

        return [
          addColor(`[${timestamp}]`, 'gray', isDev),
          ' ',
          addColor('-->', 'gray', isDev),
          ' ',
          method,
          ' ',
          addColor(url, 'gray', isDev),
        ].join('');
      },
      {
        immediate: true,
      },
    );
  },
  postLog: ({ isDev = true }: { isDev?: boolean } = {}): RequestHandler => {
    return morgan((tokens, req, res) => {
      const timestamp = dayjs().format('YYYY-MM-DD HH:mm:ss.SSS');

      const method = tokens['method']?.(req, res);

      if (!method) {
        throw createHttpError(`Post log token 'method' not found`);
      }

      const url = tokens['url']?.(req, res);

      if (!url) {
        throw createHttpError(`Post log token 'url' not found`);
      }

      const status = tokens['status']?.(req, res);

      if (!status) {
        throw createHttpError(`Post log token 'status' not found`);
      }

      const statusColor = getHttpStatusColor(Number(status));

      const responseTime = tokens['response-time']?.(req, res);

      if (!responseTime) {
        throw createHttpError(`Post log token 'response-time' not found`);
      }

      return [
        addColor(`[${timestamp}]`, 'gray', isDev),
        ' ',
        addColor('-->', 'gray', isDev),
        ' ',
        method,
        ' ',
        addColor(url, 'gray', isDev),
        ' ',
        addColor(status, statusColor, isDev),
        ' ',
        addColor(`${responseTime}ms`, 'gray', isDev),
      ].join('');
    });
  },
};

export const errorMiddlewares = {
  httpError: (): ErrorRequestHandler => {
    return (e: UnknownError, req, res, next) => {
      console.error(e);
      next(createHttpError(e));
    };
  },
  respondHttpError: ({
    isDev = true,
  }: { isDev?: boolean } = {}): ErrorRequestHandler => {
    return (e: HttpError, req, res, next) => {
      const status = e.status;

      res.status(status).json({
        error: {
          status,
          message:
            isDev || status === 500 ? e.message : 'Internal Server Error',
          stack: isDev ? e.stack : undefined,
        },
      });

      next();
    };
  },
};
