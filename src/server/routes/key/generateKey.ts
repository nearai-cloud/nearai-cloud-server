import { RequestHandler } from 'express';
import ctx from 'express-http-context';
import * as v from 'valibot';
import { lightLLM } from '../../../services/light-llm';
import { CTX_KEYS, INPUT_LIMITS } from '../../../utils/consts';
import { Auth, auth } from '../../middlewares/auth';
import {
  inputParser,
  outputParser,
  createResolver,
} from '../../middlewares/parse';

const bodyInputSchema = v.object({
  keyAlias: v.optional(
    v.pipe(v.string(), v.maxLength(INPUT_LIMITS.KEY_ALIAS_MAX_LENGTH)),
  ),
});

type BodyInput = v.InferOutput<typeof bodyInputSchema>;

const outputSchema = v.object({
  key: v.string(),
  expires: v.nullable(v.string()),
});

type Output = v.InferInput<typeof outputSchema>;

const resolver: RequestHandler = createResolver<Output>(async () => {
  const { user }: Auth = ctx.get(CTX_KEYS.AUTH);
  const { keyAlias }: BodyInput = ctx.get(CTX_KEYS.BODY_INPUT);

  const { key, expires } = await lightLLM.generateKey({
    userId: user.userId,
    keyAlias: keyAlias,
    models: ['all-team-models'],
    teamId: undefined, // TODO: Specify a team id
  });

  return {
    key,
    expires,
  };
});

export const generateKey: RequestHandler[] = [
  inputParser({
    bodyInputSchema,
  }),
  auth,
  resolver,
  outputParser({
    outputSchema,
  }),
];
