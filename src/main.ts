import { runServer } from './server/app';
import { sendSlackInfo } from './services/slack';
import { runMigrations } from './migrations';

async function main() {
  await runMigrations();

  runServer();
  await sendSlackInfo('Server started');
}

void main();
