import { Response } from 'supertest';
import {
  ApiOptions,
  ApiResponse,
  CreateCredentialOptions,
  CreateCredentialResponse,
  DeleteKeyOptions,
  DeleteKeyResponse,
  EmptyRecord,
  GenerateKeyOptions,
  GenerateKeyResponse,
  GenerateServiceAccountOptions,
  GenerateServiceAccountResponse,
  GetKeyOptions,
  GetKeyResponse,
  GetUserOptions,
  GetUserResponse,
  ListCredentialsOptions,
  ListCredentialsResponse,
  ListKeysOptions,
  ListKeysResponse,
  ListUsersOptions,
  ListUsersResponse,
  RegisterUserOptions,
  RegisterUserResponse,
  UpdateCredentialOptions,
  UpdateCredentialResponse,
  UpdateKeyOptions,
  UpdateKeyResponse,
} from '../types/api';

async function GET<TQuery, TData>({
  agent,
  query,
  authorization,
  path,
}: ApiOptions<TQuery, EmptyRecord> & { path: string }): Promise<
  ApiResponse<TData>
> {
  const request = agent.get(path);

  if (authorization) {
    request.auth(authorization, { type: 'bearer' });
  }

  if (query) {
    request.query(query);
  }

  const res = await request;

  return parseApiResponse(res);
}

async function POST<TBody, TData>({
  agent,
  body,
  authorization,
  path,
}: ApiOptions<EmptyRecord, TBody> & { path: string }): Promise<
  ApiResponse<TData>
> {
  const request = agent.post(path);

  if (authorization) {
    request.auth(authorization, { type: 'bearer' });
  }

  if (body) {
    request.send(body);
  }

  const res = await request;

  return parseApiResponse(res);
}

function parseApiResponse<T>(res: Response): ApiResponse<T> {
  if (res.status >= 200 && res.status < 300) {
    return {
      status: res.status,
      data: res.body,
      error: undefined,
    };
  }

  return {
    status: res.status,
    data: undefined,
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

export async function updateKey(
  options: UpdateKeyOptions,
): Promise<UpdateKeyResponse> {
  return POST({
    ...options,
    path: '/key/update',
  });
}

export async function deleteKey(
  options: DeleteKeyOptions,
): Promise<DeleteKeyResponse> {
  return POST({
    ...options,
    path: '/key/delete',
  });
}

export async function getKey(options: GetKeyOptions): Promise<GetKeyResponse> {
  return GET({
    ...options,
    path: '/key/info',
  });
}

export async function listKeys(
  options: ListKeysOptions,
): Promise<ListKeysResponse> {
  return GET({
    ...options,
    path: '/key/list',
  });
}

export async function createCredential(
  options: CreateCredentialOptions,
): Promise<CreateCredentialResponse> {
  return POST({
    ...options,
    path: '/credential/new',
  });
}

export async function updateCredential(
  options: UpdateCredentialOptions,
): Promise<UpdateCredentialResponse> {
  return POST({
    ...options,
    path: '/credential/update',
  });
}

export async function listCredentials(
  options: ListCredentialsOptions,
): Promise<ListCredentialsResponse> {
  return GET({
    ...options,
    path: '/credential/list',
  });
}
