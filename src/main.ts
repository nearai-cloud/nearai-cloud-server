import { sendSlackInfo } from './services/slack';
import { runMigrations } from './migrations';
import { runServer } from './server/app';

async function main() {
  runMigrations();
  runServer();
  await sendSlackInfo('Server started');
}

void main();
