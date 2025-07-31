import { RequestHandler } from 'express';
import ctx from 'express-http-context';
import * as v from 'valibot';
import { lightLLM } from '../../../services/light-llm';
import { CONTEXT_KEYS, STATUS_CODES } from '../../../utils/consts';
import { Auth, auth } from '../../middlewares/auth';
import { parseInput, parseOutput } from '../../../utils/parsers';
import { throwHttpError } from '../../../utils/error';
import { Key } from '../../../types/light-llm';

const inputSchema = v.object({
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

const additionalAuth: RequestHandler = async (req, res, next) => {
  const { user }: Auth = ctx.get(CONTEXT_KEYS.AUTH);

  const { keyOrKeyHash } = parseInput(inputSchema, req.query);

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

const resolver: RequestHandler = async (req, res) => {
  const key: Key | null = ctx.get('key');

  const output = parseOutput(
    outputSchema,
    key
      ? {
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
        }
      : null,
  );

  res.json(output);
};

export const getKey: RequestHandler[] = [auth, additionalAuth, resolver];
