import ctx from 'express-http-context';
import * as v from 'valibot';
import { lightLLM } from '../../../services/light-llm';
import { CTX_GLOBAL_KEYS, STATUS_CODES } from '../../../utils/consts';
import { Auth, authMiddleware } from '../../middlewares/auth';
import { createRouteResolver } from '../../middlewares/route-resolver';
import { throwHttpError } from '../../../utils/error';
import { Key } from '../../../types/light-llm';
import { keyForbiddenMessage } from './get-key';

const inputSchema = v.object({
  keyHash: v.string(),
});

export const generateKey = createRouteResolver({
  inputs: {
    body: inputSchema,
  },
  middlewares: [
    authMiddleware,
    async (req, res, next, { body }) => {
      const { user }: Auth = ctx.get(CTX_GLOBAL_KEYS.AUTH);

      const key = await lightLLM.getKey(body.keyHash);

      if (key && key.userId !== user.userId) {
        throwHttpError({
          status: STATUS_CODES.FORBIDDEN,
          message: keyForbiddenMessage(key.userId),
        });
      }

      ctx.set('key', key);

      next();
    },
  ],
  resolve: async () => {
    const key: Key | null = ctx.get('key');

    if (key) {
      await lightLLM.deleteKey({
        keyOrKeyHashes: [key.keyOrKeyHash],
      });
    }
  },
});
