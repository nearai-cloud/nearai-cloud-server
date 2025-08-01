import { RequestHandler } from 'express';
import { createRouteHandler } from '../middlewares/parse';

export const ping: RequestHandler[] = createRouteHandler({
  handle: () => 'NEAR AI Cloud Server',
});
