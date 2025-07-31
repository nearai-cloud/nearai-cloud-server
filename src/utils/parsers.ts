import * as v from 'valibot';
import { throwHttpError } from './error';
import { STATUS_CODES } from './consts';

export function parseInput<
  S extends v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>,
>(schema: S, data: unknown): v.InferOutput<typeof schema> {
  try {
    return v.parse(schema, data);
  } catch (e: unknown) {
    if (e instanceof v.ValiError) {
      throwHttpError({
        status: STATUS_CODES.BAD_REQUEST,
        cause: e,
      });
    }

    throw e;
  }
}

export function parseOutput<
  S extends v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>,
>(schema: S, data: v.InferInput<typeof schema>): unknown {
  try {
    return v.parse(schema, data);
  } catch (e: unknown) {
    if (e instanceof v.ValiError) {
      throwHttpError({
        status: STATUS_CODES.INTERNAL_SERVER_ERROR,
        cause: e,
      });
    }

    throw e;
  }
}
