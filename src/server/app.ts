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

  app.use(preLog({ isDev: config.log.color }));
  app.use(postLog({ isDev: config.log.color }));

  app.use(router);

  app.use(httpError());
  app.use(
    respondHttpError({
      isDev: config.server.respondErrorDetails,
    }),
  );

  app.listen(config.server.port);
}
