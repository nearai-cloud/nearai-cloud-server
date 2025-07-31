import * as v from 'valibot';
import { NextFunction } from 'express';

export type InputSchema = v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>;

export type InputParserOptions = {
  paramsInputSchema?: InputSchema;
  queryInputSchema?: InputSchema;
  bodyInputSchema?: InputSchema;
};

export type OutputSchema = v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>;

export type OutputParserOptions = {
  outputSchema: OutputSchema;
};

export type SendOutputOptions<T> = {
  output: T;
  next: NextFunction;
};
