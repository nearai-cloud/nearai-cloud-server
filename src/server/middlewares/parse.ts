import * as v from 'valibot';
import ctx from 'express-http-context';
import { throwHttpError } from '../../utils/error';
import { CTX_GLOBAL_KEYS, STATUS_CODES } from '../../utils/consts';
import { Request, RequestHandler, Response } from 'express';
import {
  InputParserOptions,
  Schema,
  OutputParserOptions,
} from '../../types/parsers';

export function inputParser({
  paramsInputSchema,
  queryInputSchema,
  bodyInputSchema,
}: InputParserOptions = {}): RequestHandler {
  return (req, res, next) => {
    if (paramsInputSchema) {
      ctx.set(
        CTX_GLOBAL_KEYS.PARAMS_INPUT,
        parseInput(paramsInputSchema, req.params),
      );
    }

    if (queryInputSchema) {
      ctx.set(
        CTX_GLOBAL_KEYS.QUERY_INPUT,
        parseInput(queryInputSchema, req.query),
      );
    }

    if (bodyInputSchema) {
      ctx.set(
        CTX_GLOBAL_KEYS.BODY_INPUT,
        parseInput(bodyInputSchema, req.body ?? {}),
      );
    }

    next();
  };
}

export function outputParser({
  outputSchema,
}: OutputParserOptions = {}): RequestHandler {
  return (req, res) => {
    let output: unknown;

    if (outputSchema) {
      output = parseOutput(outputSchema, ctx.get(CTX_GLOBAL_KEYS.OUTPUT));
    }

    if (output === undefined) {
      res.send();
    } else {
      res.json(output);
    }
  };
}

export function createResolver<T>(
  resolver: (req: Request, res: Response) => T | PromiseLike<T>,
): RequestHandler {
  return async (req, res, next) => {
    const output = await resolver(req, res);

    if (output !== undefined) {
      ctx.set(CTX_GLOBAL_KEYS.OUTPUT, output);
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
