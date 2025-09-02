import supertest, { Agent } from 'supertest';
import { runMigrations } from '../../src/migrations';
import { createApp } from '../../src/server/app';
import { runGlobalCleaners } from '../../src/utils/global-cleaners';

export function setupServer(): Agent {
  runMigrations();

  const app = createApp();
  return supertest(app);
}

export function teardownServer() {
  // Ensure that tests can exit normally
  runGlobalCleaners();
}
