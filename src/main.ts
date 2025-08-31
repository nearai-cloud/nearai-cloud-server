import { startServer } from './server';
import { sendSlackInfo } from './services/slack';

async function main() {
  startServer();
  await sendSlackInfo('Server started');
}

void main();
