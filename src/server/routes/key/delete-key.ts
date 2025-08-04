import ctx from 'express-http-context';
import * as v from 'valibot';
import { liteLLM } from '../../../services/lite-llm';
import { CTX_GLOBAL_KEYS, STATUS_CODES } from '../../../utils/consts';
import { Auth, authMiddleware } from '../../middlewares/auth';
import { createRouteResolver } from '../../middlewares/route-resolver';
import { throwHttpError } from '../../../utils/error';
import { Key } from '../../../types/lite-llm';
import { keyForbiddenMessage } from './get-key';

const inputSchema = v.object({
  keyOrKeyHash: v.string(),
});

export const deleteKey = createRouteResolver({
  inputs: {
    body: inputSchema,
  },
  middlewares: [
    authMiddleware,
    async (req, res, next, { body }) => {
      const { user }: Auth = ctx.get(CTX_GLOBAL_KEYS.AUTH);

      const key = await liteLLM.getKey(body.keyOrKeyHash);

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
      await liteLLM.deleteKey({
        keyOrKeyHashes: [key.keyOrKeyHash],
      });
    }
  },
});
