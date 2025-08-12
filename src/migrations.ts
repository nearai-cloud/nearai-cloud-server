import { spawnSync } from 'node:child_process';
import { logger } from './services/logger';

const SCHEMA_FILE_PATH = '.prisma/nearai-cloud.schema.prisma';

export function runMigrations() {
  logger.info(`${'-'.repeat(40)} Start run migrations ${'-'.repeat(40)}`);

  const isUpToDate = migrateStatus();

  if (isUpToDate) {
    return;
  }

  migrateDeploy();

  logger.info(`${'-'.repeat(40)} End run migrations ${'-'.repeat(42)}`);
}

function migrateStatus(): boolean {
  const command = spawnSync('prisma', [
    'migrate',
    'status',
    '--schema',
    SCHEMA_FILE_PATH,
  ]);

  if (command.error) {
    throw command.error;
  }

  if (command.stderr.byteLength > 0) {
    throw new Error(command.stderr.toString());
  }

  if (command.stdout.byteLength > 0) {
    logger.info(`\n${command.stdout.toString()}`);
  }

  return command.status === 0;
}

function migrateDeploy() {
  const command = spawnSync('prisma', [
    'migrate',
    'deploy',
    '--schema',
    SCHEMA_FILE_PATH,
  ]);

  if (command.error) {
    throw command.error;
  }

  if (command.stderr.byteLength > 0) {
    throw new Error(command.stderr.toString());
  }

  if (command.stdout.byteLength > 0) {
    logger.info(`\n${command.stdout.toString()}`);
  }
}
