import express from 'express';
import cors from 'cors';
import { config } from '../config';
import { logMiddlewares, errorMiddlewares } from './middlewares';
import { router } from './routes';

export function runServer() {
  const app = express();

  app.use(cors());

  app.use(logMiddlewares.preLog({ isDev: config.log.color }));
  app.use(logMiddlewares.postLog({ isDev: config.log.color }));

  app.use(router);

  app.use(errorMiddlewares.httpError());
  app.use(
    errorMiddlewares.respondHttpError({
      isDev: config.server.respondErrorDetails,
    }),
  );

  app.listen(config.server.port);
}
