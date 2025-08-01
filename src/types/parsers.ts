import * as v from 'valibot';
import { NextFunction, Request, RequestHandler, Response } from 'express';

export type BaseSchema = v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>;
export type UnknownSchema = v.UnknownSchema;
export type UndefinedSchema = v.UndefinedSchema<undefined>;

export type RouteHandler = RequestHandler[];

export type PreHandle<TParamsInput, TQueryInput, TBodyInput> = (
  req: Request,
  res: Response,
  next: NextFunction,
  options: PreHandleOptions<TParamsInput, TQueryInput, TBodyInput>,
) => void;

export type PreHandleOptions<TParamsInput, TQueryInput, TBodyInput> = {
  params: TParamsInput;
  query: TQueryInput;
  body: TBodyInput;
};

export type Handle<TParamsInput, TQueryInput, TBodyInput, TOutput> = (
  options: HandleOptions<TParamsInput, TQueryInput, TBodyInput>,
) => TOutput | PromiseLike<TOutput>;
export type HandleOptions<TParamsInput, TQueryInput, TBodyInput> = {
  params: TParamsInput;
  query: TQueryInput;
  body: TBodyInput;
  req: Request;
  res: Response;
};

export type CreateRouteHandlerOptions<
  TParamsInputSchema extends BaseSchema,
  TQueryInputSchema extends BaseSchema,
  TBodyInputSchema extends BaseSchema,
  TOutputSchema extends BaseSchema,
> = {
  paramsInputSchema?: TParamsInputSchema;
  queryInputSchema?: TQueryInputSchema;
  bodyInputSchema?: TBodyInputSchema;
  outputSchema?: TOutputSchema;
  preHandle?: PreHandle<
    v.InferOutput<TParamsInputSchema>,
    v.InferOutput<TQueryInputSchema>,
    v.InferOutput<TBodyInputSchema>
  >[];
  handle: Handle<
    v.InferOutput<TParamsInputSchema>,
    v.InferOutput<TQueryInputSchema>,
    v.InferOutput<TBodyInputSchema>,
    v.InferInput<TOutputSchema>
  >;
};
