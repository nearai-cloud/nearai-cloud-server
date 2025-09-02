import * as v from 'valibot';
import { Agent } from 'supertest';
import { outputSchema as getUserOutputSchema } from '../../src/server/routes/user/get-user';
import {
  inputSchema as listUsersInputSchema,
  outputSchema as listUsersOutputSchema,
} from '../../src/server/routes/user/list-users';
import {
  inputSchema as generateKeyInputSchema,
  outputSchema as generateKeyOutputSchema,
} from '../../src/server/routes/key/generate-key';
import {
  inputSchema as generateServiceAccountInputSchema,
  outputSchema as generateServiceAccountOutputSchema,
} from '../../src/server/routes/key/generate-service-account';
import {
  inputSchema as getKeyInputSchema,
  outputSchema as getKeyOutputSchema,
} from '../../src/server/routes/key/get-key';

export type EmptyRecord = Record<string, never>;

export type ApiResponse<T> = {
  status: number;
  data?: T;
  error?: {
    message: string;
    type: string | null;
    params: string | null;
    code: string | null;
  };
};

export type ApiOptions<TQuery, TBody> = {
  agent: Agent;
  query?: TQuery;
  body?: TBody;
  authorization?: string;
};

// ------------------------------------------------------------------------

export type GetUserOptions = ApiOptions<EmptyRecord, EmptyRecord>;
export type GetUserResponse = ApiResponse<
  v.InferOutput<typeof getUserOutputSchema>
>;

export type ListUsersOptions = ApiOptions<
  v.InferInput<typeof listUsersInputSchema>,
  EmptyRecord
>;
export type ListUsersResponse = ApiResponse<
  v.InferOutput<typeof listUsersOutputSchema>
>;

export type RegisterUserOptions = ApiOptions<EmptyRecord, EmptyRecord>;
export type RegisterUserResponse = ApiResponse<EmptyRecord>;

export type GenerateKeyOptions = ApiOptions<
  EmptyRecord,
  v.InferInput<typeof generateKeyInputSchema>
>;
export type GenerateKeyResponse = ApiResponse<
  v.InferOutput<typeof generateKeyOutputSchema>
>;

export type GenerateServiceAccountOptions = ApiOptions<
  EmptyRecord,
  v.InferInput<typeof generateServiceAccountInputSchema>
>;
export type GenerateServiceAccountResponse = ApiResponse<
  v.InferOutput<typeof generateServiceAccountOutputSchema>
>;

export type GetKeyOptions = ApiOptions<
  v.InferInput<typeof getKeyInputSchema>,
  EmptyRecord
>;
export type GetKeyResponse = ApiResponse<
  v.InferOutput<typeof getKeyOutputSchema>
>;
