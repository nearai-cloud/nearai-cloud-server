import { ErrorRequestHandler, RequestHandler } from "express";
import { ENV_IS_DEV } from "../utils/envs";
import { logger, loggerOptions } from "../services/logger";
import winston from "winston";
import expressWinston from "express-winston";

export function requestLogger(): RequestHandler {
  const winstonInstance = winston.createLogger(loggerOptions);
  return expressWinston.logger({
    winstonInstance,
  });
}

export function error(): ErrorRequestHandler {
  return (e, req, res, next) => {
    logger.error(e.message);

    const status = e.status ?? 500;
    const message = ENV_IS_DEV || status === 500 ? e.message : 'Internal Server Error';
    const stack = ENV_IS_DEV ? e.stack : undefined;

    res.status(status).json({
      message,
      stack,
    });
  }
}
