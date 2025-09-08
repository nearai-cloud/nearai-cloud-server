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
  inputSchema as updateKeyInputSchema,
  inputSchema as deleteKeyInputSchema,
} from '../../src/server/routes/key/update-key';
import {
  inputSchema as generateServiceAccountInputSchema,
  outputSchema as generateServiceAccountOutputSchema,
} from '../../src/server/routes/key/generate-service-account';
import {
  inputSchema as getKeyInputSchema,
  outputSchema as getKeyOutputSchema,
} from '../../src/server/routes/key/get-key';
import {
  inputSchema as listKeysInputSchema,
  outputSchema as listKeysOutputSchema,
} from '../../src/server/routes/key/list-keys';
import { inputSchema as createCredentialInputSchema } from '../../src/server/routes/credential/create-credential';
import { inputSchema as updateCredentialInputSchema } from '../../src/server/routes/credential/update-credential';
import { outputSchema as listCredentialsOutputSchema } from '../../src/server/routes/credential/list-credentials';
import {
  inputSchema as createModelInputSchema,
  outputSchema as createModelOutputSchema,
} from '../../src/server/routes/model/create-model';
import { inputSchema as updateModelInputSchema } from '../../src/server/routes/model/update-model';
import { inputSchema as deleteModelInputSchema } from '../../src/server/routes/model/delete-model';
import {
  inputSchema as getModelInputSchema,
  outputSchema as getModelOutputSchema,
} from '../../src/server/routes/model/get-model';
import {
  inputSchema as listModelsInputSchema,
  outputSchema as listModelsOutputSchema,
} from '../../src/server/routes/model/list-models';
import { OpenAI } from 'openai/client';

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

export type UpdateKeyOptions = ApiOptions<
  EmptyRecord,
  v.InferInput<typeof updateKeyInputSchema>
>;
export type UpdateKeyResponse = ApiResponse<EmptyRecord>;

export type DeleteKeyOptions = ApiOptions<
  EmptyRecord,
  v.InferInput<typeof deleteKeyInputSchema>
>;
export type DeleteKeyResponse = ApiResponse<EmptyRecord>;

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

export type ListKeysOptions = ApiOptions<
  v.InferInput<typeof listKeysInputSchema>,
  EmptyRecord
>;
export type ListKeysResponse = ApiResponse<
  v.InferOutput<typeof listKeysOutputSchema>
>;

export type CreateCredentialOptions = ApiOptions<
  EmptyRecord,
  v.InferInput<typeof createCredentialInputSchema>
>;
export type CreateCredentialResponse = ApiResponse<EmptyRecord>;

export type UpdateCredentialOptions = ApiOptions<
  EmptyRecord,
  v.InferInput<typeof updateCredentialInputSchema>
>;
export type UpdateCredentialResponse = ApiResponse<EmptyRecord>;

export type ListCredentialsOptions = ApiOptions<EmptyRecord, EmptyRecord>;
export type ListCredentialsResponse = ApiResponse<
  v.InferInput<typeof listCredentialsOutputSchema>
>;

export type CreateModelOptions = ApiOptions<
  EmptyRecord,
  v.InferInput<typeof createModelInputSchema>
>;
export type CreateModelResponse = ApiResponse<
  v.InferOutput<typeof createModelOutputSchema>
>;

export type UpdateModelOptions = ApiOptions<
  EmptyRecord,
  v.InferInput<typeof updateModelInputSchema>
>;
export type UpdateModelResponse = ApiResponse<EmptyRecord>;

export type DeleteModelOptions = ApiOptions<
  EmptyRecord,
  v.InferInput<typeof deleteModelInputSchema>
>;
export type DeleteModelResponse = ApiResponse<EmptyRecord>;

export type GetModelOptions = ApiOptions<
  v.InferInput<typeof getModelInputSchema>,
  EmptyRecord
>;
export type GetModelResponse = ApiResponse<
  v.InferOutput<typeof getModelOutputSchema>
>;

export type ListModelsOptions = ApiOptions<
  v.InferInput<typeof listModelsInputSchema>,
  EmptyRecord
>;
export type ListModelsResponse = ApiResponse<
  v.InferOutput<typeof listModelsOutputSchema>
>;

export type ChatCompletionsOptions = ApiOptions<
  EmptyRecord,
  OpenAI.ChatCompletionCreateParamsNonStreaming
>;
export type ChatCompletionsResponse = ApiResponse<OpenAI.ChatCompletion>;
