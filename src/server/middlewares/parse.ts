import * as v from 'valibot';
import ctx from 'express-http-context';
import { throwHttpError } from '../../utils/error';
import { CTX_KEYS, STATUS_CODES } from '../../utils/consts';
import { RequestHandler } from 'express';
import {
  InputParserOptions,
  OutputParserOptions,
  SendOutputOptions,
} from '../../types/parsers';

export function inputParser({
  paramsInputSchema,
  queryInputSchema,
  bodyInputSchema,
}: InputParserOptions = {}): RequestHandler {
  return (req, res, next) => {
    let params: unknown;
    let query: unknown;
    let body: unknown;

    try {
      if (paramsInputSchema) {
        params = v.parse(paramsInputSchema, req.params);
      }

      if (queryInputSchema) {
        query = v.parse(queryInputSchema, req.query);
      }

      if (bodyInputSchema) {
        body = v.parse(bodyInputSchema, req.body);
      }
    } catch (e: unknown) {
      if (e instanceof v.ValiError) {
        throwHttpError({
          status: STATUS_CODES.BAD_REQUEST,
          cause: e,
        });
      }

      throw e;
    }

    if (params) {
      ctx.set(CTX_KEYS.PARAMS_INPUT, params);
    }

    if (query) {
      ctx.set(CTX_KEYS.QUERY_INPUT, query);
    }

    if (body) {
      ctx.set(CTX_KEYS.BODY_INPUT, body);
    }

    next();
  };
}

export function outputParser({
  outputSchema,
}: OutputParserOptions): RequestHandler {
  return (req, res) => {
    let output: unknown = ctx.get(CTX_KEYS.OUTPUT);

    try {
      output = v.parse(outputSchema, output);
    } catch (e: unknown) {
      if (e instanceof v.ValiError) {
        throwHttpError({
          cause: e,
        });
      }

      throw e;
    }

    if (output === undefined) {
      res.send();
    } else {
      res.json(output);
    }
  };
}

export function sendOutput<T>({ output, next }: SendOutputOptions<T>) {
  ctx.set(CTX_KEYS.OUTPUT, output);
  next();
}
