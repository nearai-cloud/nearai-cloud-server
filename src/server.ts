import { Server } from 'http';
import { runMigrations } from './migrations';
import { runServer } from './server/app';
import { clearGlobalIntervals } from './utils/global-intervals';

export function startServer(): Server {
  runMigrations();
  return runServer();
}

export function stopServer(server: Server) {
  server.close();
  clearGlobalIntervals();
}
