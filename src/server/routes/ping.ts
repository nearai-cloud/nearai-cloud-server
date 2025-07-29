import { RequestHandler } from 'express';

export const ping: RequestHandler = (req, res) => {
  res.send('NEAR AI Cloud Server');
};
