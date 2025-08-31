import { Server } from 'node:http';
import { startServer, stopServer } from '../../src/server';

describe('', () => {
  let server: Server;

  beforeAll(() => {
    server = startServer();
  });

  afterAll(() => {
    stopServer(server);
  });

  test('', async () => {});
});
