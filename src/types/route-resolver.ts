import * as v from 'valibot';
import { NextFunction, Request, RequestHandler, Response } from 'express';

export type BaseSchema = v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>;
export type UnknownSchema = v.UnknownSchema;
export type UndefinedSchema = v.UndefinedSchema<undefined>;

export type RouteResolver = RequestHandler[];

export type Inputs<TParams, TQuery, TBody> = {
  params: TParams;
  query: TQuery;
  body: TBody;
};

export type CreateRouteResolverOptions<
  TParamsInputSchema extends BaseSchema,
  TQueryInputSchema extends BaseSchema,
  TBodyInputSchema extends BaseSchema,
  TOutputSchema extends BaseSchema,
> = {
  inputs?: Partial<
    Inputs<TParamsInputSchema, TQueryInputSchema, TBodyInputSchema>
  >;
  output?: TOutputSchema;
  middlewares?: RouteResolverMiddleware<
    v.InferOutput<TParamsInputSchema>,
    v.InferOutput<TQueryInputSchema>,
    v.InferOutput<TBodyInputSchema>
  >[];
  resolve: RouteResolve<
    v.InferOutput<TParamsInputSchema>,
    v.InferOutput<TQueryInputSchema>,
    v.InferOutput<TBodyInputSchema>,
    v.InferInput<TOutputSchema>
  >;
};

export type RouteResolve<TParamsInput, TQueryInput, TBodyInput, TOutput> = (
  options: RouteResolveOptions<TParamsInput, TQueryInput, TBodyInput>,
) => TOutput | PromiseLike<TOutput>;

export type RouteResolveOptions<TParamsInput, TQueryInput, TBodyInput> = {
  req: Request;
  res: Response;
  inputs: Inputs<TParamsInput, TQueryInput, TBodyInput>;
};

export type RouteResolverMiddleware<TParamsInput, TQueryInput, TBodyInput> = (
  req: Request,
  res: Response,
  next: NextFunction,
  inputs: Inputs<TParamsInput, TQueryInput, TBodyInput>,
) => unknown; // Use `unknown` instead of `void | PromiseLike<void>` for Express `RequestHandler` compatibility
