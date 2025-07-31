import { RequestHandler } from 'express';
import ctx from 'express-http-context';
import { User } from '@supabase/supabase-js';
import * as v from 'valibot';
import { lightLLM } from '../../../services/light-llm';
import { KEY_ALIAS_MAX_LENGTH } from '../../../utils/consts';
import { throwHttpError } from '../../../utils/error';
import { STATUS_CODES } from '../../../utils/consts';
import { auth } from '../../middlewares/auth';

const inputSchema = v.object({
  keyAlias: v.optional(v.pipe(v.string(), v.maxLength(KEY_ALIAS_MAX_LENGTH))),
});

type Input = v.InferOutput<typeof inputSchema>;

const input: RequestHandler = (req, res, next) => {
  let input: Input;

  try {
    input = v.parse(inputSchema, req.body);
  } catch (e: unknown) {
    throwHttpError({
      status: STATUS_CODES.BAD_REQUEST,
      cause: e,
    });
  }

  ctx.set('input', input);

  next();
};

const resolver: RequestHandler = async (req, res) => {
  const user: User = ctx.get('user');
  const input: Input = ctx.get('input');

  const { key, expires } = await lightLLM.generateKey({
    userId: user.id,
    keyAlias: input.keyAlias,
    models: ['all-team-models'],
    teamId: undefined, // TODO: Specify a team id
  });

  res.json({
    key,
    expires,
  });
};

export const generate: RequestHandler[] = [auth, input, resolver];
