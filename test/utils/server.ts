import supertest, { Agent } from 'supertest';
import { runMigrations } from '../../src/migrations';
import { createApp } from '../../src/server/app';

export function setupServer(): Agent {
  runMigrations();

  const app = createApp();
  return supertest(app);
}
