import { RequestHandler } from 'express';
import ctx from 'express-http-context';
import * as v from 'valibot';
import { lightLLM } from '../../../services/light-llm';
import { CONTEXT_KEYS, INPUT_LIMITS } from '../../../utils/consts';
import { Auth, auth } from '../../middlewares/auth';
import { parseInput, parseOutput } from '../../../utils/parsers';

const inputSchema = v.object({
  keyAlias: v.optional(
    v.pipe(v.string(), v.maxLength(INPUT_LIMITS.KEY_ALIAS_MAX_LENGTH)),
  ),
});

const outputSchema = v.object({
  key: v.string(),
  expires: v.nullable(v.string()),
});

const resolver: RequestHandler = async (req, res) => {
  const { user }: Auth = ctx.get(CONTEXT_KEYS.AUTH);

  const { keyAlias } = parseInput(inputSchema, req.body);

  const { key, expires } = await lightLLM.generateKey({
    userId: user.userId,
    keyAlias: keyAlias,
    models: ['all-team-models'],
    teamId: undefined, // TODO: Specify a team id
  });

  const output = parseOutput(outputSchema, {
    key,
    expires,
  });

  res.json(output);
};

export const generateKey: RequestHandler[] = [auth, resolver];
