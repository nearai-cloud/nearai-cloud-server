import { RequestHandler } from 'express';
import ctx from 'express-http-context';
import { lightLLM } from '../../../services/light-llm';
import { CTX_KEYS, STATUS_CODES } from '../../../utils/consts';
import { Auth, auth } from '../../middlewares/auth';

const resolver: RequestHandler = async (req, res) => {
  const { user }: Auth = ctx.get(CTX_KEYS.AUTH);

  await lightLLM.registerUser({
    userId: user.id,
    userEmail: user.email,
  });

  res.sendStatus(STATUS_CODES.SUCCESS);
};

export const registerUser: RequestHandler[] = [auth, resolver];
