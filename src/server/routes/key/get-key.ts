import ctx from 'express-http-context';
import * as v from 'valibot';
import { lightLLM } from '../../../services/light-llm';
import { CTX_GLOBAL_KEYS, STATUS_CODES } from '../../../utils/consts';
import { Auth, auth } from '../../middlewares/auth';
import { throwHttpError } from '../../../utils/error';
import { createRouteHandler } from '../../middlewares/parse';
import { Key } from '../../../types/light-llm';
import { PreHandle, RouteHandler } from '../../../types/parsers';

// Note: raw query input is always a string
const queryInputSchema = v.object({
  keyOrKeyHash: v.string(),
});

const outputSchema = v.nullable(
  v.object({
    keyOrKeyHash: v.string(),
    keyName: v.string(),
    keyAlias: v.nullable(v.string()),
    spend: v.number(),
    expires: v.nullable(v.string()),
    userId: v.nullable(v.string()),
    rpmLimit: v.nullable(v.number()),
    tpmLimit: v.nullable(v.number()),
    budgetId: v.nullable(v.string()),
    maxBudget: v.nullable(v.number()),
    budgetDuration: v.nullable(v.string()),
    budgetResetAt: v.nullable(v.string()),
  }),
);

const additionalAuth: PreHandle<
  unknown,
  v.InferOutput<typeof queryInputSchema>,
  unknown
> = async (req, res, next, { query }) => {
  const { user }: Auth = ctx.get(CTX_GLOBAL_KEYS.AUTH);

  const key = await lightLLM.getKey(query.keyOrKeyHash);

  if (key && key.userId !== user.userId) {
    throwHttpError({
      status: STATUS_CODES.FORBIDDEN,
      message: `No permission to ge the key that is owned by ${key.userId ? `user (${key.userId})` : 'service account'}`,
    });
  }

  ctx.set('key', key);

  next();
};

export const getKey: RouteHandler = createRouteHandler({
  queryInputSchema,
  outputSchema,
  preHandle: [auth, additionalAuth],
  handle: async () => {
    const key: Key | null = ctx.get('key');

    if (!key) {
      return null;
    } else {
      return {
        keyOrKeyHash: key.keyOrKeyHash,
        keyName: key.keyName,
        keyAlias: key.keyAlias,
        spend: key.spend,
        expires: key.expires,
        userId: key.userId,
        rpmLimit: key.rpmLimit,
        tpmLimit: key.tpmLimit,
        budgetId: key.budgetId,
        maxBudget: key.maxBudget,
        budgetDuration: key.budgetDuration,
        budgetResetAt: key.budgetResetAt,
      };
    }
  },
});
