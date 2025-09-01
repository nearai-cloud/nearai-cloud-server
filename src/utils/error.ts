import createHttpError, { HttpError, isHttpError } from 'http-errors';
import {
  InternalOpenAiHttpErrorOptions,
  ThrowHttpErrorOptions,
  OpenAiHttpError,
  ThrowOpenAiHttpErrorOptions,
  openAiErrorSchema,
} from '../types/error';
import * as v from 'valibot';

export function isOpenAiHttpError(e: unknown): e is OpenAiHttpError {
  if (!isHttpError(e)) {
    return false;
  }

  const { success } = v.safeParse(openAiErrorSchema, e);

  return success;
}

export function createOpenAiHttpError({
  status,
  message,
  cause,
  type,
  param,
  code,
}: ThrowOpenAiHttpErrorOptions = {}): OpenAiHttpError {
  return new InternalOpenAiHttpError({
    status,
    message,
    cause,
    type,
    param,
    code,
  });
}

function internalCreateHttpError({
  status,
  message,
  cause,
}: ThrowHttpErrorOptions = {}): HttpError {
  const error = message ?? cause;
  if (status && error) {
    return createHttpError(status, error);
  } else if (!status && error) {
    return createHttpError(error);
  } else if (status && !error) {
    return createHttpError(status);
  } else {
    return createHttpError();
  }
}

class InternalOpenAiHttpError extends Error implements OpenAiHttpError {
  status: number;
  statusCode: number;
  expose: boolean;

  type: string;
  param: string | null;
  code: string | null;

  constructor({
    status,
    message,
    cause,
    type,
    param,
    code,
  }: InternalOpenAiHttpErrorOptions) {
    const e = internalCreateHttpError({
      status,
      message,
      cause,
    });

    super(e.message, {
      cause,
    });

    this.status = e.status;
    this.statusCode = e.statusCode;
    this.expose = e.expose;

    this.type = type ?? 'error';
    this.param = param ?? null;
    this.code = code ?? e.status.toString();

    this.name = e.name;
  }
}
