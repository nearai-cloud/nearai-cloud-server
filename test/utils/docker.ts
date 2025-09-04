import Docker from 'dockerode';
import { sleep } from './common';

export const LITELLM_IMAGE = 'ghcr.io/berriai/litellm:v1.74.15-stable';
export const LITELLM_MASTER_KEY = 'sk-master';
export const LITELLM_SALT_KEY = 'sk-salt';
export const LITELLM_DATABASE_URL =
  'postgresql://admin:admin@litellm-gateway-database:5432/litellm-gateway';

const docker = new Docker();
const containers: Docker.Container[] = [];
const networks: Docker.Network[] = [];

export async function setupContainers() {
  const network = await docker.createNetwork({
    Name: `nearai-cloud-integration-test-${Date.now()}`,
    Driver: 'bridge',
  });

  await setupLitellmGatewayDatabaseContainer(network.id);
  await setupLitellmGatewayContainer(network.id);
  await setupNearAiCloudDatabaseContainer(network.id);

  networks.push(network);

  await sleep(25 * 1000);
}

export async function teardownContainers() {
  for (const container of containers) {
    await container.remove({ force: true });
  }

  for (const network of networks) {
    await network.remove();
  }

  await sleep(5 * 1000);
}

async function setupNearAiCloudDatabaseContainer(networkId: string) {
  const container = await docker.createContainer({
    Image: 'postgres:16',
    name: 'nearai-cloud-database',
    Env: [
      'POSTGRES_USER=admin',
      'POSTGRES_PASSWORD=admin',
      'POSTGRES_DB=nearai-cloud',
    ],
    HostConfig: {
      PortBindings: { '5432/tcp': [{ HostPort: '3002' }] },
      NetworkMode: networkId,
    },
  });

  await container.start();

  containers.push(container);
}

async function setupLitellmGatewayDatabaseContainer(networkId: string) {
  const container = await docker.createContainer({
    Image: 'postgres:16',
    name: 'litellm-gateway-database',
    Env: [
      'POSTGRES_USER=admin',
      'POSTGRES_PASSWORD=admin',
      'POSTGRES_DB=litellm-gateway',
    ],
    HostConfig: {
      PortBindings: { '5432/tcp': [{ HostPort: '4002' }] },
      NetworkMode: networkId,
    },
  });

  await container.start();

  containers.push(container);
}

async function setupLitellmGatewayContainer(networkId: string) {
  const container = await docker.createContainer({
    Image: LITELLM_IMAGE,
    name: 'litellm-gateway',
    Env: [
      'STORE_MODEL_IN_DB=true',
      `DATABASE_URL=${LITELLM_DATABASE_URL}`,
      `LITELLM_MASTER_KEY=${LITELLM_MASTER_KEY}`,
      `LITELLM_SALT_KEY=${LITELLM_SALT_KEY}`,
    ],
    HostConfig: {
      PortBindings: { '4000/tcp': [{ HostPort: '4001' }] },
      NetworkMode: networkId,
    },
  });

  await container.start();

  containers.push(container);
}
