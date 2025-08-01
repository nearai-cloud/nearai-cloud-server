import ctx from 'express-http-context';
import * as v from 'valibot';
import { Auth, authMiddleware } from '../../middlewares/auth';
import { createRouteResolver } from '../../middlewares/route-resolver';
import { lightLLM } from '../../../services/light-llm';
import { CTX_GLOBAL_KEYS } from '../../../utils/consts';

// Note: raw query input is always a string
const inputSchema = v.object({
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

const outputSchema = v.nullable(
  v.object({
    keyHashes: v.array(v.string()),
    totalKeys: v.number(),
    page: v.number(),
    pageSize: v.number(),
    totalPages: v.number(),
  }),
);

export const getKeys = createRouteResolver({
  inputs: {
    query: inputSchema,
  },
  output: outputSchema,
  middlewares: [authMiddleware],
  resolve: async ({ inputs: { query } }) => {
    const { user }: Auth = ctx.get(CTX_GLOBAL_KEYS.AUTH);

    const keys = await lightLLM.listKeys({
      page: query.page,
      pageSize: query.pageSize,
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
  },
});
