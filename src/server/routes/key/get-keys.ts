import { RequestHandler } from 'express';
import ctx from 'express-http-context';
import * as v from 'valibot';
import { Auth, auth } from '../../middlewares/auth';
import {
  createResolver,
  inputParser,
  outputParser,
} from '../../middlewares/parse';
import { lightLLM } from '../../../services/light-llm';
import { CTX_GLOBAL_KEYS } from '../../../utils/consts';

// Note: raw query input is always a string
const queryInputSchema = v.object({
  page: v.optional(
    v.pipe(
      v.string(),
      v.transform((page) => Number(page)),
      v.integer(),
    ),
  ),
  pageSize: v.optional(
    v.pipe(
      v.string(),
      v.transform((page) => Number(page)),
      v.integer(),
    ),
  ),
});

type QueryInputSchema = v.InferOutput<typeof queryInputSchema>;

const outputSchema = v.nullable(
  v.object({
    keyHashes: v.array(v.string()),
    totalKeys: v.number(),
    page: v.number(),
    pageSize: v.number(),
    totalPages: v.number(),
  }),
);

type Output = v.InferInput<typeof outputSchema>;

const resolver: RequestHandler = createResolver<Output>(async () => {
  const { user }: Auth = ctx.get(CTX_GLOBAL_KEYS.AUTH);
  const { page, pageSize }: QueryInputSchema = ctx.get(
    CTX_GLOBAL_KEYS.QUERY_INPUT,
  );

  const keys = await lightLLM.listKeys({
    page,
    pageSize,
    userId: user.userId,
    teamId: undefined, // TODO: Maybe need to specify a team id
    sortBy: 'created_at',
    sortOrder: 'desc',
  });

  return {
    keyHashes: keys.keyHashes,
    totalKeys: keys.totalKeys,
    page: keys.page,
    pageSize: keys.pageSize,
    totalPages: keys.totalPages,
  };
});

export const getKeys: RequestHandler[] = [
  inputParser({
    queryInputSchema,
  }),
  auth,
  resolver,
  outputParser({
    outputSchema,
  }),
];
