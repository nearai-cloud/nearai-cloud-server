import internalCreateHttpError, { HttpError, isHttpError } from 'http-errors';
import {
  InternalOpenAiHttpErrorOptions,
  ThrowHttpErrorOptions,
  OpenAiHttpError,
  ThrowOpenAiHttpErrorOptions,
} from '../types/error';
import * as v from 'valibot';

function createHttpError({
  status,
  message,
  cause,
}: ThrowHttpErrorOptions = {}) {
  const error = message ?? cause;
  if (status && error) {
    return internalCreateHttpError(status, error);
  } else if (!status && error) {
    return internalCreateHttpError(error);
  } else if (status && !error) {
    return internalCreateHttpError(status);
  } else {
    return internalCreateHttpError();
  }
}

export function createOpenAiHttpError({
  status,
  message,
  cause,
  param,
  code,
}: ThrowOpenAiHttpErrorOptions = {}): OpenAiHttpError {
  return new InternalOpenAiHttpError({
    status,
    message,
    cause,
    param,
    code,
  });
}

export function isOpenAiHttpError(e: unknown): e is OpenAiHttpError {
  if (!isHttpError(e)) {
    return false;
  }

  const schema = v.object({
    type: v.nullable(v.string()),
    param: v.nullable(v.string()),
    code: v.nullable(v.string()),
  });

  const { success } = v.safeParse(schema, e);

  return success;
}

class InternalOpenAiHttpError extends Error implements HttpError {
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
    param,
    code,
  }: InternalOpenAiHttpErrorOptions) {
    const e = createHttpError({
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

    this.type = 'error';
    this.param = param ?? null;
    this.code = code ?? e.status.toString();

    this.name = InternalOpenAiHttpError.name;
  }
}
