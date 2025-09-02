import { setupContainers, teardownContainers } from './docker';
import { setupServer } from './server';
import { Agent } from 'supertest';

export async function setup(): Promise<Agent> {
  await setupContainers();
  return setupServer();
}

export async function tearDown() {
  await teardownContainers();
}
