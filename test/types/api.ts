import * as v from 'valibot';
import { outputSchema as getUserOutputSchema } from '../../src/server/routes/user/get-user';
import { Agent } from 'supertest';

export type Empty = Record<string, never>;

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

export type GetUserOptions = ApiOptions<Empty>;
export type GetUserResponse = ApiResponse<
  v.InferOutput<typeof getUserOutputSchema>
>;

export type RegisterUserOptions = ApiOptions<Empty>;
export type RegisterUserResponse = ApiResponse<Empty>;
