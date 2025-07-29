import winston, { LoggerOptions } from 'winston';
import { config } from '../config';

export const loggerOptions: LoggerOptions = {
  level: config.logger.level,
  transports: [new winston.transports.Console()],
  format: winston.format.combine(
    winston.format.colorize({ all: true }),
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss.SSS',
    }),
    winston.format.align(),
    winston.format.printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`),
  ),
}

export const logger = winston.createLogger(loggerOptions);
