import * as v from 'valibot';
import ctx from 'express-http-context';
import { throwHttpError } from '../../utils/error';
import { CTX_KEYS, STATUS_CODES } from '../../utils/consts';
import { RequestHandler } from 'express';
import {
  InputParserOptions,
  Schema,
  OutputParserOptions,
  SendOutputOptions,
} from '../../types/parsers';

export function inputParser({
  paramsInputSchema,
  queryInputSchema,
  bodyInputSchema,
}: InputParserOptions = {}): RequestHandler {
  return (req, res, next) => {
    if (paramsInputSchema) {
      ctx.set(CTX_KEYS.PARAMS_INPUT, parseInput(paramsInputSchema, req.params));
    }

    if (queryInputSchema) {
      ctx.set(CTX_KEYS.QUERY_INPUT, parseInput(queryInputSchema, req.query));
    }

    if (bodyInputSchema) {
      ctx.set(CTX_KEYS.BODY_INPUT, parseInput(bodyInputSchema, req.body ?? {}));
    }

    next();
  };
}

function parseInput(schema: Schema, data: unknown): unknown {
  try {
    return v.parse(schema, data);
  } catch (e: unknown) {
    if (e instanceof v.ValiError) {
      throwHttpError({
        status: STATUS_CODES.BAD_REQUEST,
        cause: e,
      });
    }

    throw e;
  }
}

export function outputParser({
  outputSchema,
}: OutputParserOptions): RequestHandler {
  return (req, res) => {
    const output = parseOutput(outputSchema, ctx.get(CTX_KEYS.OUTPUT));

    if (output === undefined) {
      res.send();
    } else {
      res.json(output);
    }
  };
}

function parseOutput(schema: Schema, data: unknown): unknown {
  try {
    return v.parse(schema, data);
  } catch (e: unknown) {
    if (e instanceof v.ValiError) {
      throwHttpError({
        cause: e,
      });
    }

    throw e;
  }
}

export function sendOutput<T>({ output, next }: SendOutputOptions<T>) {
  ctx.set(CTX_KEYS.OUTPUT, output);
  next();
}
