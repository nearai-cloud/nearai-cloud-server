import { RequestHandler } from 'express';
import ctx from 'express-http-context';
import { User } from '@supabase/supabase-js';
import * as v from 'valibot';
import { lightLLM } from '../../../services/light-llm';
import { KEY_ALIAS_MAX_LENGTH } from '../../../utils/consts';
import { throwHttpError } from '../../../utils/error';

export const generate: RequestHandler = async (req, res) => {
  const user: User = ctx.get('user');

  const bodySchema = v.object({
    alias: v.pipe(v.string(), v.maxLength(KEY_ALIAS_MAX_LENGTH)),
  });

  let body;

  try {
    body = v.parse(bodySchema, req.body);
  } catch (e: unknown) {
    throwHttpError({
      status: 400,
      cause: e,
    });
  }

  await lightLLM.generateKey({
    userId: user.id,
    alias: body.alias,
  });

  res.sendStatus(200);
};
