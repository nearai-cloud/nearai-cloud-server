import { runMigrations } from '../../src/migrations';
import { createServer } from '../../src/server/app';
import { runGlobalCleaners } from '../../src/utils/global-cleaners';
import supertest, { Agent } from 'supertest';

export function simulateStartServer(): Agent {
  runMigrations();
  const server = createServer();
  return supertest(server);
}

export function simulateStopServer() {
  runGlobalCleaners();
}
