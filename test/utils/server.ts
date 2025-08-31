import { runMigrations } from '../../src/migrations';
import { createServer } from '../../src/server/app';
import { runGlobalCleaners } from '../../src/utils/global-cleaners';
import supertest, { Agent } from 'supertest';

export function setupServer(): Agent {
  runMigrations();
  const server = createServer();
  return supertest(server);
}

export function teardownServer() {
  runGlobalCleaners();
}
