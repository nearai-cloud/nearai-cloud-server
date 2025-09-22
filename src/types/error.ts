import { HttpError } from 'http-errors';
import * as v from 'valibot';

export type ThrowHttpErrorOptions = {
  status?: number;
  message?: string;
  cause?: unknown;
};

export type ThrowOpenAiHttpErrorOptions = {
  status?: number;
  message?: string;
  cause?: unknown;
  type?: string;
  param?: string;
  code?: string;
};

export type InternalOpenAiHttpErrorOptions = {
  status?: number;
  message?: string;
  cause?: unknown;
  type?: string;
  param?: string;
  code?: string;
};

export interface OpenAiHttpError extends OpenAiError, HttpError {}

export type OpenAiError = v.InferOutput<typeof openAiErrorSchema>;

export const openAiErrorSchema = v.object({
  message: v.string(),
  type: v.string(),
  param: v.nullable(v.string()),
  code: v.nullable(v.string()),
});
