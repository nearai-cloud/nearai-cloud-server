import Docker from 'dockerode';
import { sleep } from './common';

const docker = new Docker();
const containers: Docker.Container[] = [];
const networks: Docker.Network[] = [];

export async function setupContainers() {
  const network = await docker.createNetwork({
    Name: 'nearai-cloud-integration-test',
    Driver: 'bridge',
  });

  await setupLitellmGatewayDatabaseContainer(network);
  await setupLitellmGatewayContainer(network);
  await setupNearAiCloudDatabaseContainer(network);

  networks.push(network);

  await sleep(10 * 1000); // TODO: health check
}

export async function teardownContainers() {
  for (const container of containers) {
    await container.remove({ force: true });
  }

  for (const network of networks) {
    await network.remove();
  }
}

async function setupLitellmGatewayDatabaseContainer(network: Docker.Network) {
  const container = await docker.createContainer({
    Image: 'postgres:16',
    name: 'litellm-gateway-db',
    Env: [
      'POSTGRES_USER=admin',
      'POSTGRES_PASSWORD=admin',
      'POSTGRES_DB=litellm-gateway',
    ],
    HostConfig: {
      PortBindings: { '5432/tcp': [{ HostPort: '4002' }] },
      NetworkMode: network.id,
    },
  });

  await container.start();

  containers.push(container);
}

async function setupNearAiCloudDatabaseContainer(network: Docker.Network) {
  const container = await docker.createContainer({
    Image: 'postgres:16',
    name: 'nearai-cloud-db',
    Env: [
      'POSTGRES_USER=admin',
      'POSTGRES_PASSWORD=admin',
      'POSTGRES_DB=nearai-cloud',
    ],
    HostConfig: {
      PortBindings: { '5432/tcp': [{ HostPort: '3002' }] },
      NetworkMode: network.id,
    },
  });

  await container.start();

  containers.push(container);
}

async function setupLitellmGatewayContainer(network: Docker.Network) {
  const container = await docker.createContainer({
    Image: 'ghcr.io/berriai/litellm:v1.74.15-stable',
    name: 'litellm-gateway',
    Env: [
      'PORT=4000',
      'STORE_MODEL_IN_DB=true',
      'DATABASE_URL=postgresql://admin:admin@litellm-gateway-db:5432/litellm-gateway',
      'LITELLM_MASTER_KEY=sk-master',
      'LITELLM_SALT_KEY=sk-salt',
    ],
    HostConfig: {
      PortBindings: { '4000/tcp': [{ HostPort: '4001' }] },
      NetworkMode: network.id,
    },
  });

  await container.start();

  containers.push(container);
}
