import { Response } from 'supertest';
import {
  ApiOptions,
  ApiResponse,
  GetUserOptions,
  GetUserResponse,
  ListUsersOptions,
  ListUsersResponse,
  RegisterUserOptions,
  RegisterUserResponse,
} from '../types/api';

async function GET<TInput, TOutput>({
  path,
  agent,
  input,
  authorization,
}: ApiOptions<TInput> & { path: string }): Promise<ApiResponse<TOutput>> {
  const request = agent.get(path);

  if (authorization) {
    request.auth(authorization, { type: 'bearer' });
  }

  if (input) {
    request.query(input);
  }

  const res = await request;

  return parseApiResponse(res);
}

async function POST<TInput, TOutput>({
  path,
  agent,
  input,
  authorization,
}: ApiOptions<TInput> & { path: string }): Promise<ApiResponse<TOutput>> {
  const request = agent.post(path);

  if (authorization) {
    request.auth(authorization, { type: 'bearer' });
  }

  if (input) {
    request.send(input);
  }

  const res = await request;

  return parseApiResponse(res);
}

function parseApiResponse<T>(res: Response): ApiResponse<T> {
  if (res.status >= 200 && res.status < 300) {
    return {
      status: res.status,
      output: res.body,
      error: undefined,
    };
  }

  return {
    status: res.status,
    output: undefined,
    error: res.body.error,
  };
}

// ------------------------------------------------------------------------

export async function getUser({
  agent,
  input,
  authorization,
}: GetUserOptions): Promise<GetUserResponse> {
  return GET({
    path: '/user/info',
    agent,
    input,
    authorization,
  });
}

export async function listUsers({
  agent,
  input,
  authorization,
}: ListUsersOptions): Promise<ListUsersResponse> {
  return GET({
    path: '/user/list',
    agent,
    input,
    authorization,
  });
}

export async function registerUser({
  agent,
  input,
  authorization,
}: RegisterUserOptions): Promise<RegisterUserResponse> {
  return POST({
    path: '/user/register',
    agent,
    input,
    authorization,
  });
}
