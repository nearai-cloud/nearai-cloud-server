import * as v from 'valibot';
import { outputSchema as getUserOutputSchema } from '../../src/server/routes/user/get-user';
import { Agent } from 'supertest';

export type ApiResponse<T = Record<string, never>> = {
  status: number;
  output?: T;
  error?: {
    message: string;
    type: string | null;
    params: string | null;
    code: string | null;
  };
};

export type ApiOptions<T = Record<string, never>> = {
  agent: Agent;
  input?: T;
  authorization?: string;
};

// ------------------------------------------------------------------------

export type GetUserOptions = ApiOptions;
export type GetUserResponse = ApiResponse<
  v.InferOutput<typeof getUserOutputSchema>
>;

export type RegisterUserOptions = ApiOptions;
export type RegisterUserResponse = ApiResponse;
