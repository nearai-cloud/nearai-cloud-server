import { RequestHandler } from 'express';
import ctx from 'express-http-context';
import * as v from 'valibot';
import { lightLLM } from '../../../services/light-llm';
import { CTX_KEYS, STATUS_CODES } from '../../../utils/consts';
import { Auth, auth } from '../../middlewares/auth';
import { throwHttpError } from '../../../utils/error';
import { Key } from '../../../types/light-llm';
import {
  createResolver,
  inputParser,
  outputParser,
} from '../../middlewares/parse';

const queryInputSchema = v.object({
  keyOrKeyHash: v.string(),
});

type QueryInput = v.InferOutput<typeof queryInputSchema>;

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

type Output = v.InferInput<typeof outputSchema>;

const additionalAuth: RequestHandler = async (req, res, next) => {
  const { user }: Auth = ctx.get(CTX_KEYS.AUTH);
  const { keyOrKeyHash }: QueryInput = ctx.get(CTX_KEYS.QUERY_INPUT);

  const key = await lightLLM.getKey(keyOrKeyHash);

  if (key && key.userId !== user.userId) {
    throwHttpError({
      status: STATUS_CODES.FORBIDDEN,
      message: `No permission to ge the key that is owned by ${key.userId ? `user (${key.userId})` : 'service account'}`,
    });
  }

  ctx.set('key', key);

  next();
};

const resolver: RequestHandler = createResolver<Output>(async () => {
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
});

export const getKey: RequestHandler[] = [
  inputParser({
    queryInputSchema,
  }),
  auth,
  additionalAuth,
  resolver,
  outputParser({
    outputSchema,
  }),
];
