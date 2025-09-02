import * as v from 'valibot';
import { Agent } from 'supertest';
import { outputSchema as getUserOutputSchema } from '../../src/server/routes/user/get-user';
import {
  inputSchema as listUsersInputSchema,
  outputSchema as listUsersOutputSchema,
} from '../../src/server/routes/user/list-users';

export type EmptyRecord = Record<string, never>;

export type ApiResponse<TOutput> = {
  status: number;
  output?: TOutput;
  error?: {
    message: string;
    type: string | null;
    params: string | null;
    code: string | null;
  };
};

export type ApiOptions<TInput> = {
  agent: Agent;
  input?: TInput;
  authorization?: string;
};

// ------------------------------------------------------------------------

export type GetUserOptions = ApiOptions<EmptyRecord>;
export type GetUserResponse = ApiResponse<
  v.InferOutput<typeof getUserOutputSchema>
>;

export type ListUsersOptions = ApiOptions<typeof listUsersInputSchema>;
export type ListUsersResponse = ApiResponse<typeof listUsersOutputSchema>;

export type RegisterUserOptions = ApiOptions<EmptyRecord>;
export type RegisterUserResponse = ApiResponse<EmptyRecord>;
