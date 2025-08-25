import { createRouteResolver } from '../../middlewares/route-resolver';
import { litellmServiceAccountAuthMiddleware } from '../../middlewares/auth';
import * as v from 'valibot';
import { adminLitellmApiClient } from '../../../services/litellm-api-client';
import { INPUT_LIMITS } from '../../../utils/consts';

const inputSchema = v.object({
  page: v.optional(
    v.pipe(
      v.string(),
      v.transform((page) => Number(page)),
      v.integer(),
      v.minValue(INPUT_LIMITS.MIN_PAGE),
    ),
  ),
  pageSize: v.optional(
    v.pipe(
      v.string(),
      v.transform((pageSize) => Number(pageSize)),
      v.integer(),
      v.minValue(INPUT_LIMITS.MIN_PAGE_SIZE),
      v.maxValue(INPUT_LIMITS.MAX_PAGE_SIZE),
    ),
  ),
});

const outputSchema = v.object({
  teams: v.array(
    v.object({
      teamId: v.string(),
      teamAlias: v.string(),
      maxBudget: v.number(),
      models: v.array(v.string()),
    }),
  ),
  totalTeams: v.number(),
  page: v.number(),
  pageSize: v.number(),
  totalPages: v.number(),
});

export const listTeams = createRouteResolver({
  inputs: {
    query: inputSchema,
  },
  output: outputSchema,
  middlewares: [litellmServiceAccountAuthMiddleware],
  resolve: async ({ inputs: { query } }) => {
    return adminLitellmApiClient.listTeams({
      page: query.page,
      pageSize: query.pageSize,
    });
  },
});
