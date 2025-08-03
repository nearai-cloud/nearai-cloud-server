import express from 'express';
import cors from 'cors';
import ctx from 'express-http-context';
import { config } from '../config';
import {
  createIncomingLogMiddleware,
  createOutgoingLogMiddleware,
} from './middlewares/log';
import {
  createHttpErrorMiddleware,
  createRespondHttpErrorMiddleware,
} from './middlewares/error';
import { router } from './routes';

export function runServer() {
  const app = express();

  app.disable('x-powered-by');
  app.set('query parser', 'extended');

  app.use(cors());

  app.use(ctx.middleware);

  app.use(createIncomingLogMiddleware({ isDev: config.isDev }));
  app.use(createOutgoingLogMiddleware({ isDev: config.isDev }));

  app.use(express.json());

  app.use(router);

  app.use(
    createHttpErrorMiddleware({
      isDev: config.isDev,
    }),
  );
  app.use(
    createRespondHttpErrorMiddleware({
      isDev: config.isDev,
    }),
  );

  app.listen(config.server.port);
}
