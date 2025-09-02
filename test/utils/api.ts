import { Response } from 'supertest';
import {
  ApiOptions,
  ApiResponse,
  GenerateKeyOptions,
  GenerateKeyResponse,
  GenerateServiceAccountOptions,
  GenerateServiceAccountResponse,
  GetUserOptions,
  GetUserResponse,
  ListUsersOptions,
  ListUsersResponse,
  RegisterUserOptions,
  RegisterUserResponse,
} from '../types/api';

async function GET<TInput, TOutput>({
  agent,
  input,
  authorization,
  path,
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
  agent,
  input,
  authorization,
  path,
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

export async function getUser(
  options: GetUserOptions,
): Promise<GetUserResponse> {
  return GET({
    ...options,
    path: '/user/info',
  });
}

export async function listUsers(
  options: ListUsersOptions,
): Promise<ListUsersResponse> {
  return GET({
    ...options,
    path: '/user/list',
  });
}

export async function registerUser(
  options: RegisterUserOptions,
): Promise<RegisterUserResponse> {
  return POST({
    ...options,
    path: '/user/register',
  });
}

export async function generateKey(
  options: GenerateKeyOptions,
): Promise<GenerateKeyResponse> {
  return POST({
    ...options,
    path: '/key/generate',
  });
}

export async function generateServiceAccount(
  options: GenerateServiceAccountOptions,
): Promise<GenerateServiceAccountResponse> {
  return POST({
    ...options,
    path: '/key/service-account/generate',
  });
}
