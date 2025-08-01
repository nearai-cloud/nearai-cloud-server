import { RequestHandler } from 'express';
import ctx from 'express-http-context';
import { lightLLM } from '../../../services/light-llm';
import { CTX_GLOBAL_KEYS } from '../../../utils/consts';
import { WeakAuth, weakAuth } from '../../middlewares/auth';
import { createResolver, outputParser } from '../../middlewares/parse';

const resolver: RequestHandler = createResolver<void>(async () => {
  const { authUser }: WeakAuth = ctx.get(CTX_GLOBAL_KEYS.WEAK_AUTH);

  await lightLLM.registerUser({
    userId: authUser.id,
    userEmail: authUser.email,
  });
});

export const registerUser: RequestHandler[] = [
  weakAuth,
  resolver,
  outputParser(),
];
