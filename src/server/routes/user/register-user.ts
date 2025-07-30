import { RequestHandler } from 'express';
import ctx from 'express-http-context';
import { lightLLM } from '../../../services/light-llm';
import { User } from '@supabase/supabase-js';

export const registerUser: RequestHandler = async (req, res) => {
  const user: User = ctx.get('user');

  await lightLLM.createUser({
    id: user.id,
    email: user.email,
  });

  res.sendStatus(200);
};
