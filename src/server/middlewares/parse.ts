import * as v from 'valibot';
import ctx from 'express-http-context';
import { throwHttpError } from '../../utils/error';
import { CTX_GLOBAL_KEYS, STATUS_CODES } from '../../utils/consts';
import { RequestHandler } from 'express';
import {
  CreateRouteHandlerOptions,
  BaseSchema,
  UndefinedSchema,
  UnknownSchema,
  RouteHandler,
} from '../../types/parsers';

export function createRouteHandler<
  TParamsInputSchema extends BaseSchema = UndefinedSchema,
  TQueryInputSchema extends BaseSchema = UndefinedSchema,
  TBodyInputSchema extends BaseSchema = UndefinedSchema,
  TOutputSchema extends BaseSchema = UnknownSchema,
>({
  paramsInputSchema,
  queryInputSchema,
  bodyInputSchema,
  outputSchema,
  preHandle = [],
  handle,
}: CreateRouteHandlerOptions<
  TParamsInputSchema,
  TQueryInputSchema,
  TBodyInputSchema,
  TOutputSchema
>): RouteHandler {
  const inputParser: RequestHandler = (req, res, next) => {
    ctx.set(
      CTX_GLOBAL_KEYS.PARAMS_INPUT,
      paramsInputSchema ? parseInput(paramsInputSchema, req.params) : undefined,
    );

    ctx.set(
      CTX_GLOBAL_KEYS.QUERY_INPUT,
      queryInputSchema ? parseInput(queryInputSchema, req.query) : undefined,
    );

    ctx.set(
      CTX_GLOBAL_KEYS.BODY_INPUT,
      bodyInputSchema ? parseInput(bodyInputSchema, req.body) : undefined,
    );

    next();
  };

  const handlers: RequestHandler[] = preHandle.map((pre) => {
    return (req, res, next) => {
      pre(req, res, next, {
        params: ctx.get(CTX_GLOBAL_KEYS.PARAMS_INPUT),
        query: ctx.get(CTX_GLOBAL_KEYS.QUERY_INPUT),
        body: ctx.get(CTX_GLOBAL_KEYS.BODY_INPUT),
      });
    };
  });

  const handler: RequestHandler = async (req, res) => {
    let output: unknown = await handle({
      params: ctx.get(CTX_GLOBAL_KEYS.PARAMS_INPUT),
      query: ctx.get(CTX_GLOBAL_KEYS.QUERY_INPUT),
      body: ctx.get(CTX_GLOBAL_KEYS.BODY_INPUT),
      req,
      res,
    });

    if (outputSchema) {
      output = parseOutput(outputSchema, output);
    }

    if (output === undefined) {
      res.send();
    } else {
      res.json(output);
    }
  };

  return [inputParser, ...handlers, handler];
}

function parseInput(schema: BaseSchema, data: unknown): unknown {
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

function parseOutput(schema: BaseSchema, data: unknown): unknown {
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
