import * as v from 'valibot';
import { NextFunction } from 'express';

export type Schema = v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>;

export type InputParserOptions = {
  paramsInputSchema?: Schema;
  queryInputSchema?: Schema;
  bodyInputSchema?: Schema;
};

export type OutputParserOptions = {
  outputSchema?: Schema;
};

export type SendOutputOptions<T> = {
  output?: T;
  next: NextFunction;
};
