import { RequestHandler } from 'express';
import ctx from 'express-http-context';
import * as v from 'valibot';
import { lightLLM } from '../../../services/light-llm';
import { CTX_KEYS, INPUT_LIMITS } from '../../../utils/consts';
import { throwHttpError } from '../../../utils/error';
import { STATUS_CODES } from '../../../utils/consts';
import { Auth, auth } from '../../middlewares/auth';

const inputSchema = v.object({
  keyAlias: v.optional(
    v.pipe(v.string(), v.maxLength(INPUT_LIMITS.KEY_ALIAS_MAX_LENGTH)),
  ),
});

type Input = v.InferOutput<typeof inputSchema>;

const inputParser: RequestHandler = (req, res, next) => {
  let input: Input;

  try {
    input = v.parse(inputSchema, req.body);
  } catch (e: unknown) {
    throwHttpError({
      status: STATUS_CODES.BAD_REQUEST,
      cause: e,
    });
  }

  ctx.set(CTX_KEYS.INPUT, input);

  next();
};

const resolver: RequestHandler = async (req, res) => {
  const { user }: Auth = ctx.get(CTX_KEYS.AUTH);
  const { keyAlias }: Input = ctx.get(CTX_KEYS.INPUT);

  const { key, expires } = await lightLLM.generateKey({
    userId: user.id,
    keyAlias: keyAlias,
    models: ['all-team-models'],
    teamId: undefined, // TODO: Specify a team id
  });

  res.json({
    key,
    expires,
  });
};

export const generateKey: RequestHandler[] = [auth, inputParser, resolver];
