import ctx from 'express-http-context';
import { RequestHandler } from 'express';
import { KeyAuth, keyAuthMiddleware } from '../../middlewares/auth';
import { CTX_GLOBAL_KEYS } from '../../../utils/consts';

export const chatCompletions: RequestHandler[] = [
  keyAuthMiddleware,
  async (req, res) => {
    const { litellmClient }: KeyAuth = ctx.get(CTX_GLOBAL_KEYS.KEY_AUTH);
    const data = await litellmClient.chatCompletions(req.body);
    if ('pipe' in data) {
      data.pipe(res);
    } else {
      res.json(data);
    }
  },
];
