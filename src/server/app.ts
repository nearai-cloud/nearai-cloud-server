import express from 'express';
import cors from 'cors';
import { config } from '../config';
import { logMiddlewares, errorMiddlewares } from './middlewares';
import { ENV_IS_DEV } from '../utils/envs';
import { router } from './routes';

export function runServer() {
  const app = express();

  app.use(cors());

  app.use(logMiddlewares.preLog({ isDev: ENV_IS_DEV }));
  app.use(logMiddlewares.postLog({ isDev: ENV_IS_DEV }));

  app.use(router);

  app.use(errorMiddlewares.httpError());
  app.use(errorMiddlewares.respondHttpError({ isDev: ENV_IS_DEV }));

  app.listen(config.server.port);
}
