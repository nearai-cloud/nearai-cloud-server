import { Express } from 'express';
import { runMigrations } from '../../src/migrations';
import { createServer } from '../../src/server/app';
import { clearGlobalIntervals } from '../../src/utils/global-intervals';

export function simulateStartServer(): Express {
  runMigrations();
  return createServer();
}

export function simulateStopServer() {
  clearGlobalIntervals();
}
