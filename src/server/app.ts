import express from 'express';
import cors from 'cors';
import { config } from "../config";
import { error, requestLogger } from "./middlewares";



export function runServer() {
  const app = express();

  app.use(cors());
  app.use(requestLogger());

  app.get('/user', async (req, res, next) => {

  });

  app.use(error());

  app.listen(config.server.port);
}
