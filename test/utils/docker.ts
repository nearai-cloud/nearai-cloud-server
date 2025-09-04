import Docker from 'dockerode';
import { sleep } from './common';

export const LITELLM_IMAGE = 'ghcr.io/berriai/litellm:v1.74.15-stable';
export const LITELLM_MASTER_KEY = 'sk-master';
export const LITELLM_SALT_KEY = 'sk-salt';
export const LITELLM_DATABASE_URL =
  'postgresql://admin:admin@litellm-gateway-database:5432/litellm-gateway';

const docker = new Docker();

const LABEL_KEY = 'test';
const LABEL_VALUE = 'nearai-cloud-integration-test';
const LABEL = `${LABEL_KEY}=${LABEL_VALUE}`;

export async function setupContainers() {
  await clearCache();

  const network = await setupNetwork();

  await setupLitellmGatewayDatabaseContainer(network);
  await setupLitellmGatewayContainer(network);
  await setupNearAiCloudDatabaseContainer(network);

  await sleep(15 * 1000);
}

export async function teardownContainers() {
  await clearCache();
}

async function setupNetwork(): Promise<Docker.Network> {
  return docker.createNetwork({
    Name: `nearai-cloud-integration-test-${Date.now()}`,
    Driver: 'bridge',
    Labels: {
      [LABEL_KEY]: LABEL_VALUE,
    },
  });
}

async function setupNearAiCloudDatabaseContainer(network: Docker.Network) {
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
      NetworkMode: network.id,
    },
    Labels: {
      [LABEL_KEY]: LABEL_VALUE,
    },
  });

  await container.start();
}

async function setupLitellmGatewayDatabaseContainer(network: Docker.Network) {
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
      NetworkMode: network.id,
    },
    Labels: {
      [LABEL_KEY]: LABEL_VALUE,
    },
  });

  await container.start();
}

async function setupLitellmGatewayContainer(network: Docker.Network) {
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
      NetworkMode: network.id,
    },
    Labels: {
      [LABEL_KEY]: LABEL_VALUE,
    },
  });

  await container.start();
}

async function clearCache() {
  const containerInfos = await docker.listContainers({
    filters: {
      label: [LABEL],
    },
  });

  for (const containerInfo of containerInfos) {
    const container = docker.getContainer(containerInfo.Id);
    await container.stop();
    await container.remove();
  }

  const networkInfos = await docker.listNetworks({
    filters: {
      label: [LABEL],
    },
  });

  for (const networkInfo of networkInfos) {
    const network = docker.getNetwork(networkInfo.Id);
    await network.remove();
  }
}
