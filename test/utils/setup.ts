import { setupContainers, teardownContainers } from './docker';
import { setupServer } from './server';
import { Agent } from 'supertest';

export async function setup(): Promise<Agent> {
  // Clear the cache left from the previous round of testing
  await teardownContainers();

  await setupContainers();

  return setupServer();
}

export async function tearDown() {
  await teardownContainers();
}
