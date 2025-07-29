import { ErrorRequestHandler, RequestHandler } from 'express';
import createHttpError, { HttpError } from 'http-errors';
import morgan from 'morgan';
import chalk from 'chalk';
import dayjs from 'dayjs';

morgan.token('colored-timestamp', () => {
  const timestamp = dayjs().format('YYYY-MM-DD HH:mm:ss.SSS');
  return chalk.gray(timestamp);
});

morgan.token('colored-status', (req, res) => {
  if (res.statusCode >= 200 && res.statusCode < 300) {
    return chalk.green(res.statusCode);
  } else if (res.statusCode >= 300 && res.statusCode < 400) {
    return chalk.blue(res.statusCode);
  } else if (res.statusCode >= 400 && res.statusCode < 500) {
    return chalk.yellow(res.statusCode);
  } else if (res.statusCode >= 500 && res.statusCode < 600) {
    return chalk.red(res.statusCode);
  } else {
    return chalk.gray(res.statusCode);
  }
});

export const logMiddlewares = {
  preLog: (): RequestHandler => {
    const coloredMessages = [
      '[',
      ':colored-timestamp',
      ']',
      ' ',
      chalk.gray('<--'),
      ' ',
      ':method',
      ' ',
      chalk.gray(':url'),
    ];

    return morgan(coloredMessages.join(''), {
      immediate: true,
    });
  },
  postLog: (): RequestHandler => {
    const coloredMessages = [
      '[',
      ':colored-timestamp',
      ']',
      ' ',
      chalk.gray('-->'),
      ' ',
      ':method',
      ' ',
      chalk.gray(':url'),
      ' ',
      ':colored-status',
      ' ',
      chalk.gray(':response-time ms'),
    ];

    return morgan(coloredMessages.join(''), {
      immediate: false,
    });
  },
};

export const errorMiddlewares = {
  httpError: (): ErrorRequestHandler => {
    return (e, req, res, next) => {
      next(createHttpError(e));
    };
  },
  respondHttpError: ({
    isDev = true,
  }: { isDev?: boolean } = {}): ErrorRequestHandler => {
    return (e: HttpError, req, res, next) => {
      console.error(e);

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
