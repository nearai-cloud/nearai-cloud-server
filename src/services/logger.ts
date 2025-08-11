import winston, { Logger, LoggerOptions } from 'winston';
import { getConfig } from '../config';

export async function createLogger({ isDev = true }: { isDev?: boolean } = {}) {
  const config = await getConfig();
  const loggerOptions: LoggerOptions = {
    level: config.log.level,
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

let globalLogger: Logger | undefined;

export async function getGlobalLogger(): Promise<Logger> {
  if (!globalLogger) {
    const config = await getConfig();
    globalLogger = await createLogger({ isDev: config.isDev });
  }
  return globalLogger;
}
