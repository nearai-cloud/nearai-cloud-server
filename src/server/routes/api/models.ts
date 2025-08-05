import ctx from 'express-http-context';
import { RequestHandler } from 'express';
import { KeyAuth, keyAuthMiddleware } from '../../middlewares/auth';
import { CTX_GLOBAL_KEYS } from '../../../utils/consts';

export const models: RequestHandler[] = [
  keyAuthMiddleware,
  async (req, res) => {
    const { litellmClient }: KeyAuth = ctx.get(CTX_GLOBAL_KEYS.KEY_AUTH);
    const models = await litellmClient.models();
    res.json(models);
  },
];
