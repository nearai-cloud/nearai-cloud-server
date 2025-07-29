import express from 'express';
import cors from 'cors';
import { config } from '../config';
import { loggerMiddlewares, errorMiddlewares } from './middlewares';
import { ENV_IS_DEV } from '../utils/envs';

export function runServer() {
  const app = express();

  app.use(cors());

  app.use(loggerMiddlewares.preLog(), loggerMiddlewares.postLog());

  app.get('/user', async (req, res) => {
    res.send();
  });

  app.use(
    errorMiddlewares.createError(),
    errorMiddlewares.formatError({ isDev: ENV_IS_DEV }),
  );

  app.listen(config.server.port);
}
