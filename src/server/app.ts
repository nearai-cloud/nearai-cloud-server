import express from 'express';
import cors from 'cors';
import ctx from 'express-http-context';
import { config } from '../config';
import { incomingLog, outgoingLog } from './middlewares/log';
import { httpError, respondHttpError } from './middlewares/error';
import { router } from './routes';

export function runServer() {
  const app = express();

  if (config.isDev) {
    app.enable('x-powered-by');
  } else {
    app.disable('x-powered-by');
  }

  app.use(cors());

  app.use(ctx.middleware);

  app.use(incomingLog({ isDev: config.isDev }));
  app.use(outgoingLog({ isDev: config.isDev }));

  app.use(router);

  app.use(
    httpError({
      isDev: config.isDev,
    }),
  );
  app.use(
    respondHttpError({
      isDev: config.isDev,
    }),
  );

  app.listen(config.server.port);
}
