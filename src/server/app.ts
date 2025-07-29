import express from 'express';
import cors from 'cors';
import { config } from '../config';
import {
  logMiddlewares,
  errorMiddlewares,
  routeMiddlewares,
} from './middlewares';
import { ENV_IS_DEV } from '../utils/envs';

export function runServer() {
  const app = express();

  app.use(cors());

  app.use(logMiddlewares.preLog());
  app.use(logMiddlewares.postLog());

  app.get('/user', async (req, res) => {
    res.json({
      user: 'TODO',
    });
  });

  app.use(routeMiddlewares.notFound());

  app.use(errorMiddlewares.httpError());
  app.use(errorMiddlewares.respondHttpError({ isDev: ENV_IS_DEV }));

  app.listen(config.server.port);
}
