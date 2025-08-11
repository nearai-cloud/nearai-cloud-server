import { runServer } from './server/app';
import { sendSlackInfo } from './services/slack';

async function main() {
  await runServer();
  await sendSlackInfo('Server started');
}

void main();
