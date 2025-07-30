import winston, { LoggerOptions } from 'winston';
import { config } from '../config';
import { ENV_IS_DEV } from '../utils/envs';

export function createLogger({ isDev = true }: { isDev?: boolean } = {}) {
  const loggerOptions: LoggerOptions = {
    level: config.logger.level,
    transports: [new winston.transports.Console()],
    format: winston.format.combine(
      ...[
        ...(isDev ? [winston.format.colorize({ all: true })] : []),
        winston.format.timestamp({
          format: 'YYYY-MM-DD HH:mm:ss.SSS',
        }),
        winston.format.align(),
        winston.format.printf(
          (info) => `[${info.timestamp}] ${info.level}: ${info.message}`,
        ),
      ],
    ),
  };

  return winston.createLogger(loggerOptions);
}

// Global logger
export const logger = createLogger({ isDev: ENV_IS_DEV });
