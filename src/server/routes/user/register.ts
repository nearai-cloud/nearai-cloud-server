import { RequestHandler } from 'express';
import ctx from 'express-http-context';
import { lightLLM } from '../../../services/light-llm';
import { User } from '@supabase/supabase-js';
import { STATUS_CODES } from '../../../utils/consts';
import { auth } from '../../middlewares/auth';

const resolver: RequestHandler = async (req, res) => {
  const user: User = ctx.get('user');

  await lightLLM.registerUser({
    id: user.id,
    email: user.email,
  });

  res.sendStatus(STATUS_CODES.SUCCESS);
};

export const register: RequestHandler[] = [auth, resolver];
