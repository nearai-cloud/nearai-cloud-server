import { spawnSync } from 'child_process';
import { logger } from './services/logger';

const SCHEMA_FILE_PATH = '.prisma/nearai-cloud.schema.prisma';

export function runMigrations() {
  logger.info(`${'-'.repeat(40)} Start running migrations ${'-'.repeat(40)}`);

  const isUpToDate = migrateStatus();

  if (!isUpToDate) {
    migrateDeploy();
  }

  logger.info(`${'-'.repeat(40)} End running migrations    ${'-'.repeat(40)}`);
}

function migrateStatus(): boolean {
  const command = spawnSync(
    'prisma',
    ['migrate', 'status', '--schema', SCHEMA_FILE_PATH],
    {
      encoding: 'utf-8',
    },
  );

  if (command.error) {
    throw command.error;
  }

  if (command.stdout.length > 0) {
    logger.info(command.stdout);
  }

  if (command.stderr.length > 0) {
    logger.error(command.stderr);
  }

  return command.status === 0;
}

function migrateDeploy() {
  const command = spawnSync(
    'prisma',
    ['migrate', 'deploy', '--schema', SCHEMA_FILE_PATH],
    {
      encoding: 'utf-8',
    },
  );

  if (command.error) {
    throw command.error;
  }

  if (command.stdout.length > 0) {
    logger.info(command.stdout);
  }

  if (command.stderr.length > 0) {
    logger.error(command.stderr);
  }

  if (command.status !== 0) {
    throw Error(`Command exited with code ${command.status}`);
  }
}
