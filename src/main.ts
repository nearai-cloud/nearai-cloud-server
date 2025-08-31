import { sendSlackInfo } from './services/slack';
import { runMigrations } from './migrations';
import { runServer } from './server/app';

void main();

async function main() {
  startServer();
  await sendSlackInfo('Server started');
}

function startServer() {
  runMigrations();
  runServer();
}
