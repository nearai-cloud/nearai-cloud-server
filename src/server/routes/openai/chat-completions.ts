import ctx from 'express-http-context';
import { RequestHandler } from 'express';
import { KeyAuth, keyAuthMiddleware } from '../../middlewares/auth';
import { CTX_GLOBAL_KEYS } from '../../../utils/consts';
import { throwHttpError } from '../../../utils/error';
import { LitellmClientError } from '../../../services/litellm';

export const chatCompletions: RequestHandler[] = [
  keyAuthMiddleware,
  async (req, res) => {
    const { litellmClient }: KeyAuth = ctx.get(CTX_GLOBAL_KEYS.KEY_AUTH);

    let completions;

    try {
      completions = await litellmClient.chatCompletions(req.body);
    } catch (e: unknown) {
      if (e instanceof LitellmClientError) {
        throwHttpError({
          status: Number(e.code),
          cause: e,
        });
      }

      throw e;
    }

    if ('pipe' in completions) {
      completions.pipe(res);
    } else {
      res.json(completions);
    }
  },
];
