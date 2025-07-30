import express from 'express';
import cors from 'cors';
import ctx from 'express-http-context';
import { config } from '../config';
import { preLog, postLog } from './middlewares/log';
import { httpError, respondHttpError } from './middlewares/error';
import { router } from './routes';

export function runServer() {
  const app = express();

  app.use(cors());

  app.use(ctx.middleware);

  app.use(preLog({ isDev: config.isDev }));
  app.use(postLog({ isDev: config.isDev }));

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
