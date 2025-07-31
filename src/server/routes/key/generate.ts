import { RequestHandler } from 'express';
import ctx from 'express-http-context';
import { User } from '@supabase/supabase-js';
import * as v from 'valibot';
import { lightLLM } from '../../../services/light-llm';
import { KEY_ALIAS_MAX_LENGTH } from '../../../utils/consts';
import { throwHttpError } from '../../../utils/error';
import { STATUS_CODES } from '../../../utils/consts';

export const generate: RequestHandler = async (req, res) => {
  const user: User = ctx.get('user');

  const bodySchema = v.object({
    keyAlias: v.pipe(v.string(), v.maxLength(KEY_ALIAS_MAX_LENGTH)),
  });

  let body;

  try {
    body = v.parse(bodySchema, req.body);
  } catch (e: unknown) {
    throwHttpError({
      status: STATUS_CODES.BAD_REQUEST,
      cause: e,
    });
  }

  const { key, expires } = await lightLLM.generateKey({
    userId: user.id,
    keyAlias: body.keyAlias,
    models: ['all-team-models'],
    teamId: undefined, // TODO: Specify a team id
  });

  res.json({
    key,
    expires,
  });
};
