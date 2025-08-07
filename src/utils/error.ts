import createHttpError from 'http-errors';
import {
  OpenAiCompatibleErrorOptions,
  ThrowHttpErrorOptions,
} from '../types/error';
import * as v from 'valibot';

export function throwHttpError({
  status,
  cause,
  message,
}: ThrowHttpErrorOptions = {}): never {
  const error = message ?? cause;
  if (status && error) {
    throw createHttpError(status, error);
  } else if (!status && error) {
    throw createHttpError(error);
  } else if (status && !error) {
    throw createHttpError(status);
  } else {
    throw createHttpError();
  }
}

export function isOpenAiCompatibleHttpError(e: unknown): boolean {
  const schema = v.object({
    message: v.string(),
    type: v.string(),
    param: v.nullable(v.string()),
    code: v.nullable(v.string()),
  });

  try {
    v.parse(schema, e);
  } catch (e: unknown) {
    if (e instanceof v.ValiError) {
      return false;
    }

    throw e;
  }

  return true;
}

export class OpenAiCompatibleHttpError extends Error {
  status: number;

  type: string;
  param: string | null;
  code: string | null;

  constructor({
    status,
    error: { message, type, param, code },
    cause,
  }: OpenAiCompatibleErrorOptions) {
    super(message, { cause });

    this.status = status;

    this.type = type;
    this.param = param;
    this.code = code;

    this.name = OpenAiCompatibleHttpError.name;
  }
}
