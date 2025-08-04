import ctx from 'express-http-context';
import * as v from 'valibot';
import { litellm } from '../../../services/litellm';
import {
  CTX_GLOBAL_KEYS,
  INPUT_LIMITS,
  STATUS_CODES,
} from '../../../utils/consts';
import { Auth, authMiddleware } from '../../middlewares/auth';
import { createRouteResolver } from '../../middlewares/route-resolver';
import { throwHttpError } from '../../../utils/error';
import { keyForbiddenMessage } from './get-key';

const inputSchema = v.object({
  keyOrKeyHash: v.string(),
  keyAlias: v.optional(
    v.pipe(v.string(), v.maxLength(INPUT_LIMITS.KEY_ALIAS_MAX_LENGTH)),
  ),
  maxBudget: v.optional(v.number()),
  blocked: v.optional(v.boolean()),
});

export const updateKey = createRouteResolver({
  inputs: {
    body: inputSchema,
  },
  middlewares: [
    authMiddleware,
    async (req, res, next, { body }) => {
      const { user }: Auth = ctx.get(CTX_GLOBAL_KEYS.AUTH);

      const key = await litellm.getKey({
        keyOrKeyHash: body.keyOrKeyHash,
      });

      if (!key) {
        throwHttpError({
          status: STATUS_CODES.BAD_REQUEST,
          message: 'Key not exists',
        });
      }

      if (key.userId !== user.userId) {
        throwHttpError({
          status: STATUS_CODES.FORBIDDEN,
          message: keyForbiddenMessage(key.userId),
        });
      }

      next();
    },
  ],
  resolve: async ({ inputs: { body } }) => {
    await litellm.updateKey({
      keyOrKeyHash: body.keyOrKeyHash,
      keyAlias: body.keyAlias,
      maxBudget: body.maxBudget,
      blocked: body.blocked,
    });
  },
});
