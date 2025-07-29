import express from 'express';
import cors from 'cors';
import { config } from '../config';
import {
  loggerMiddlewares,
  errorMiddlewares,
  routeMiddlewares,
} from './middlewares';
import { ENV_IS_DEV } from '../utils/envs';

export function runServer() {
  const app = express();

  app.use(cors());

  app.use(loggerMiddlewares.preLog());
  app.use(loggerMiddlewares.postLog());

  app.get('/user', async (req, res) => {
    res.json({
      user: 'TODO',
    });
  });

  app.use(routeMiddlewares.notFound());

  app.use(errorMiddlewares.createError());
  app.use(errorMiddlewares.formatError({ isDev: ENV_IS_DEV }));

  app.listen(config.server.port);
}
