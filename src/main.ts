import { runServer } from './server/app';
import { sendSlackInfo } from './services/slack';
import { config } from './config';

async function main() {
  console.log(config);

  runServer();
  await sendSlackInfo('Server started');
}

await main();
