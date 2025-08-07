import { HttpError } from 'http-errors';

export type ThrowHttpErrorOptions = {
  status?: number;
  message?: string;
  cause?: unknown;
};

export type ThrowOpenAiHttpErrorOptions = {
  status?: number;
  message?: string;
  cause?: unknown;
  param?: string;
  code?: string;
};

export type InternalOpenAiHttpErrorOptions = {
  status?: number;
  message?: string;
  cause?: unknown;
  param?: string;
  code?: string;
};

export interface OpenAiHttpError extends HttpError {
  type: string;
  param: string | null;
  code: string | null;
}
