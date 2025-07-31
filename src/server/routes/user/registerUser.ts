import { RequestHandler } from 'express';
import ctx from 'express-http-context';
import * as v from 'valibot';
import { lightLLM } from '../../../services/light-llm';
import { CONTEXT_KEYS } from '../../../utils/consts';
import { WeakAuth, weakAuth } from '../../middlewares/auth';
import { parseOutput } from '../../../utils/parsers';

const outputSchema = v.object({});

const resolver: RequestHandler = async (req, res) => {
  const { authUser }: WeakAuth = ctx.get(CONTEXT_KEYS.WEAK_AUTH);

  await lightLLM.registerUser({
    userId: authUser.id,
    userEmail: authUser.email,
  });

  const output = parseOutput(outputSchema, {});

  res.json(output);
};

export const registerUser: RequestHandler[] = [weakAuth, resolver];
