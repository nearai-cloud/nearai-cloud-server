import { runMigrations } from '../../src/migrations';
import { createServer } from '../../src/server/app';
import { clearGlobalIntervals } from '../../src/utils/global-intervals';
import supertest, { Agent } from 'supertest';

export function simulateStartServer(): Agent {
  runMigrations();
  const server = createServer();
  return supertest(server);
}

export function simulateStopServer() {
  clearGlobalIntervals();
}
