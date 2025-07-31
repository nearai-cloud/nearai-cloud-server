import { RequestHandler } from 'express';
import ctx from 'express-http-context';
import { lightLLM } from '../../../services/light-llm';
import { CTX_KEYS } from '../../../utils/consts';
import { WeakAuth, weakAuth } from '../../middlewares/auth';

const resolver: RequestHandler = async (req, res) => {
  const { authUser }: WeakAuth = ctx.get(CTX_KEYS.WEAK_AUTH);

  const user = await lightLLM.getUser(authUser.id);

  if (user) {
    res.json({
      userId: user.userId,
      userEmail: user.userEmail,
    });
  } else {
    res.json(null);
  }
};

export const getUser: RequestHandler[] = [weakAuth, resolver];
