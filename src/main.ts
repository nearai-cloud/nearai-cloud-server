import { sendSlackInfo } from './services/slack';
import { runMigrations } from './migrations';
import { runServer } from './server/app';
import { config } from './config';

async function main() {
  runMigrations(config.isDev);
  runServer();
  await sendSlackInfo('Server started');
}

void main();
