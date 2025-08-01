import * as v from 'valibot';
import { NextFunction, Request, RequestHandler, Response } from 'express';

export type BaseSchema = v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>;
export type UnknownSchema = v.UnknownSchema;
export type UndefinedSchema = v.UndefinedSchema<undefined>;

export type RouteHandlers = RequestHandler[];

export type CreateRouteHandlersOptions<
  TParamsInputSchema extends BaseSchema,
  TQueryInputSchema extends BaseSchema,
  TBodyInputSchema extends BaseSchema,
  TOutputSchema extends BaseSchema,
> = {
  paramsInputSchema?: TParamsInputSchema;
  queryInputSchema?: TQueryInputSchema;
  bodyInputSchema?: TBodyInputSchema;
  outputSchema?: TOutputSchema;
  middlewares?: RouteMiddleware<
    v.InferOutput<TParamsInputSchema>,
    v.InferOutput<TQueryInputSchema>,
    v.InferOutput<TBodyInputSchema>
  >[];
  handle: HandleRoute<
    v.InferOutput<TParamsInputSchema>,
    v.InferOutput<TQueryInputSchema>,
    v.InferOutput<TBodyInputSchema>,
    v.InferInput<TOutputSchema>
  >;
};

export type HandleRoute<TParamsInput, TQueryInput, TBodyInput, TOutput> = (
  options: HandleRouteOptions<TParamsInput, TQueryInput, TBodyInput>,
) => TOutput | PromiseLike<TOutput>;

export type HandleRouteOptions<TParamsInput, TQueryInput, TBodyInput> = {
  params: TParamsInput;
  query: TQueryInput;
  body: TBodyInput;
  req: Request;
  res: Response;
};

export type RouteMiddleware<TParamsInput, TQueryInput, TBodyInput> = (
  req: Request,
  res: Response,
  next: NextFunction,
  options: RouteMiddlewareOptions<TParamsInput, TQueryInput, TBodyInput>,
) => unknown; // Use `unknown` instead of `void | PromiseLike<void>` for Express `RequestHandler` compatibility

export type RouteMiddlewareOptions<TParamsInput, TQueryInput, TBodyInput> = {
  params: TParamsInput;
  query: TQueryInput;
  body: TBodyInput;
};
