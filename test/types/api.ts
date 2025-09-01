import * as v from 'valibot';
import { outputSchema as getUserOutputSchema } from '../../src/server/routes/user/get-user';
import { Agent } from 'supertest';

export type ApiResponse<T = unknown> = {
  status: number;
  output?: T;
  error?: {
    message: string;
    type: string | null;
    params: string | null;
    code: string | null;
  };
};

export type ApiOptions<T = unknown> = {
  agent: Agent;
  input?: T;
  authorization?: string;
};

export type GetUserOptions = ApiOptions;
export type GetUserResponse = ApiResponse<
  v.InferOutput<typeof getUserOutputSchema>
>;

export type RegisterUserOptions = ApiOptions;
export type RegisterUserResponse = ApiResponse; // TODO
