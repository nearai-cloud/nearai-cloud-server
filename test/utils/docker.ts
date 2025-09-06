import Docker from 'dockerode';
import { sleep } from './common';
import { LITELLM_MASTER_KEY, LITELLM_IMAGE, DATABASE_IMAGE } from './consts';

const docker = new Docker();

const LABEL_KEY = 'test';
const LABEL_VALUE = 'nearai-cloud-integration-test';
const LABEL = `${LABEL_KEY}=${LABEL_VALUE}`;

export async function setupContainers() {
  await docker.pull(LITELLM_IMAGE);
  await docker.pull(DATABASE_IMAGE);

  const timestamp = Date.now();

  const network = await setupNetwork(timestamp);

  await setupNearAiCloudDatabaseContainer(timestamp, network);
  await setupLitellmGatewayDatabaseContainer(timestamp, network);
  await setupLitellmGatewayContainer(timestamp, network);

  await sleep(20 * 1000);
}

export async function teardownContainers() {
  const containerInfos = await docker.listContainers({
    all: true,
    filters: {
      label: [LABEL],
    },
  });

  for (const containerInfo of containerInfos) {
    const container = docker.getContainer(containerInfo.Id);
    if (containerInfo.State === 'running') {
      await container.stop();
    }
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

async function setupNetwork(timestamp: number): Promise<Docker.Network> {
  return docker.createNetwork({
    Name: `nearai-cloud-integration-test-${timestamp}`,
    Driver: 'bridge',
    Labels: {
      [LABEL_KEY]: LABEL_VALUE,
    },
  });
}

async function setupNearAiCloudDatabaseContainer(
  timestamp: number,
  network: Docker.Network,
) {
  const container = await docker.createContainer({
    Image: DATABASE_IMAGE,
    name: `nearai-cloud-database-${timestamp}`,
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

async function setupLitellmGatewayDatabaseContainer(
  timestamp: number,
  network: Docker.Network,
) {
  const container = await docker.createContainer({
    Image: DATABASE_IMAGE,
    name: `litellm-gateway-database-${timestamp}`,
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

async function setupLitellmGatewayContainer(
  timestamp: number,
  network: Docker.Network,
) {
  const container = await docker.createContainer({
    Image: LITELLM_IMAGE,
    name: `litellm-gateway-${timestamp}`,
    Env: [
      'STORE_MODEL_IN_DB=true',
      `DATABASE_URL=postgresql://admin:admin@litellm-gateway-database-${timestamp}:5432/litellm-gateway`,
      `LITELLM_MASTER_KEY=${LITELLM_MASTER_KEY}`,
      `LITELLM_SALT_KEY=sk-salt`,
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
