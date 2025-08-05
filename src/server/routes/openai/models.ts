import ctx from 'express-http-context';
import { RequestHandler } from 'express';
import { KeyAuth, keyAuthMiddleware } from '../../middlewares/auth';
import { CTX_GLOBAL_KEYS } from '../../../utils/consts';
import { LitellmClientError } from '../../../services/litellm';
import { throwHttpError } from '../../../utils/error';

export const models: RequestHandler[] = [
  keyAuthMiddleware,
  async (req, res) => {
    const { litellmClient }: KeyAuth = ctx.get(CTX_GLOBAL_KEYS.KEY_AUTH);

    let models;

    try {
      models = await litellmClient.models();
    } catch (e: unknown) {
      if (e instanceof LitellmClientError) {
        throwHttpError({
          status: Number(e.code),
          cause: e,
        });
      }

      throw e;
    }

    res.json(models);
  },
];
