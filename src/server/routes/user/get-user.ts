import { RequestHandler } from 'express';
import ctx from 'express-http-context';
import * as v from 'valibot';
import { lightLLM } from '../../../services/light-llm';
import { CTX_GLOBAL_KEYS } from '../../../utils/consts';
import { WeakAuth, weakAuth } from '../../middlewares/auth';
import { createResolver, outputParser } from '../../middlewares/parse';

const outputSchema = v.nullable(
  v.object({
    userId: v.string(),
    userEmail: v.nullable(v.string()),
  }),
);

type Output = v.InferInput<typeof outputSchema>;

const resolver: RequestHandler = createResolver<Output>(async () => {
  const { authUser }: WeakAuth = ctx.get(CTX_GLOBAL_KEYS.WEAK_AUTH);

  const user = await lightLLM.getUser(authUser.id);

  if (!user) {
    return null;
  }

  return {
    userId: user.userId,
    userEmail: user.userEmail,
  };
});

export const getUser: RequestHandler[] = [
  weakAuth,
  resolver,
  outputParser({ outputSchema }),
];
