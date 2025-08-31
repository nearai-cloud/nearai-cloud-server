import { runMigrations } from '../../src/migrations';
import { runServer } from '../../src/server/app';

export function runTestServer() {
  runMigrations();
  runServer();
}
