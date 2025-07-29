import { RequestHandler } from 'express';
import { sleep } from '../../utils/time';

export const ping: RequestHandler = async (req, res) => {
  await sleep(5000);
  res.send('NEAR AI Cloud Server');
};
