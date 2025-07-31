import { RequestHandler } from 'express';
import ctx from 'express-http-context';
import * as v from 'valibot';
import { lightLLM } from '../../../services/light-llm';
import { CONTEXT_KEYS } from '../../../utils/consts';
import { WeakAuth, weakAuth } from '../../middlewares/auth';
import { parseOutput } from '../../../utils/parsers';

const outputSchema = v.nullable(
  v.object({
    userId: v.string(),
    userEmail: v.nullable(v.string()),
  }),
);

const resolver: RequestHandler = async (req, res) => {
  const { authUser }: WeakAuth = ctx.get(CONTEXT_KEYS.WEAK_AUTH);

  const user = await lightLLM.getUser(authUser.id);

  const output = parseOutput(
    outputSchema,
    user
      ? {
          userId: user.userId,
          userEmail: user.userEmail,
        }
      : null,
  );

  res.json(output);
};

export const getUser: RequestHandler[] = [weakAuth, resolver];
