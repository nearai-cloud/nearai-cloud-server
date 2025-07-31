import { RequestHandler } from 'express';
import ctx from 'express-http-context';
import { lightLLM } from '../../../services/light-llm';
import { CTX_KEYS } from '../../../utils/consts';
import { WeakAuth, weakAuth } from '../../middlewares/auth';

const resolver: RequestHandler = async (req, res) => {
  const { authUser }: WeakAuth = ctx.get(CTX_KEYS.WEAK_AUTH);

  await lightLLM.registerUser({
    userId: authUser.id,
    userEmail: authUser.email,
  });

  res.send();
};

export const registerUser: RequestHandler[] = [weakAuth, resolver];
