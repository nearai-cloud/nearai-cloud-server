import { Response } from 'supertest';
import {
  ApiResponse,
  GetUserOptions,
  GetUserResponse,
  RegisterUserOptions,
  RegisterUserResponse,
} from '../types/api';

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

export async function getUser({
  agent,
  authorization,
}: GetUserOptions): Promise<GetUserResponse> {
  const request = agent.get('/user/info');

  if (authorization) {
    request.auth(authorization, { type: 'bearer' });
  }

  const res = await request;

  return parseApiResponse(res);
}

export async function registerUser({
  agent,
  authorization,
}: RegisterUserOptions): Promise<RegisterUserResponse> {
  const request = agent.post('/user/register');

  if (authorization) {
    request.auth(authorization, { type: 'bearer' });
  }

  const res = await request;

  return parseApiResponse(res);
}
