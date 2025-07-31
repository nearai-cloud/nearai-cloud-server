import { RequestHandler } from 'express';
import ctx from 'express-http-context';
import { lightLLM } from '../../../services/light-llm';
import { CONTEXT_KEYS, STATUS_CODES } from '../../../utils/consts';
import { WeakAuth, weakAuth } from '../../middlewares/auth';

const resolver: RequestHandler = async (req, res) => {
  const { authUser }: WeakAuth = ctx.get(CONTEXT_KEYS.WEAK_AUTH);

  await lightLLM.registerUser({
    userId: authUser.id,
    userEmail: authUser.email,
  });

  res.status(STATUS_CODES.NO_CONTENT).send();
};

export const registerUser: RequestHandler[] = [weakAuth, resolver];
