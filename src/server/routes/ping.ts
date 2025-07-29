import { RequestHandler } from 'express';

export const ping: RequestHandler = async (req, res) => {
  res.send('NEAR AI Cloud Server');
};
