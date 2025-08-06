import {
  RegisterUserParams,
  GenerateKeyParams,
  DeleteKeyParams,
  GenerateKeyResponse,
  ListKeysParams,
  ListKeysResponse,
  User,
  Key,
  LitellmApiClientErrorOptions,
  UpdateKeyParams,
  GetSpendLogsParams,
  SpendLog,
  GetUserParams,
  GetKeyParams,
} from '../types/litellm-api-client';
import { config } from '../config';
import axios, { AxiosError } from 'axios';
import { OpenAI } from 'openai/client';
import stream from 'node:stream';
import {
  ApiClient,
  ApiClientOptions,
  RequestOptions,
} from '../utils/api-client';

export class LitellmApiClientError extends Error {
  type: string;
  param: string;
  code: string;

  constructor(options: LitellmApiClientErrorOptions, cause?: unknown) {
    super(options.error.message, {
      cause,
    });

    this.type = options.error.type;
    this.param = options.error.param;
    this.code = options.error.code;

    this.name = LitellmApiClientError.name;
  }
}

export class LitellmApiClient extends ApiClient {
  constructor(options: ApiClientOptions) {
    super(options);
  }

  protected async request<T, P = unknown, B = unknown>(
    options: RequestOptions<P, B>,
  ): Promise<T> {
    try {
      return await super.request(options);
    } catch (e: unknown) {
      if (axios.isAxiosError(e) && e.response?.data) {
        throw new LitellmApiClientError(e.response.data, e);
      }

      throw e;
    }
  }

  async registerUser({ userId, userEmail }: RegisterUserParams) {
    await this.post<
      void,
      {
        user_id?: string;
        user_email?: string;
        auto_create_key?: boolean;
        user_role?: string;
      }
    >({
      path: '/user/new',
      body: {
        user_id: userId,
        user_email: userEmail,
        auto_create_key: false,
        user_role: 'internal_user_viewer',
      },
    });
  }

  async getUser({ userId }: GetUserParams): Promise<User | null> {
    const { user_info } = await this.get<
      {
        user_info: {
          user_id?: string;
          user_email: string | null;
          spend: number;
        };
      },
      {
        user_id: string;
      }
    >({
      path: '/user/info',
      query: {
        user_id: userId,
      },
    });

    if (!user_info.user_id) {
      return null;
    }

    return {
      userId: user_info.user_id,
      userEmail: user_info.user_email,
      spend: user_info.spend,
    };
  }

  async generateKey({
    userId,
    teamId,
    keyAlias,
    keyDuration,
    models,
    maxBudget,
    rpmLimit,
    tpmLimit,
  }: GenerateKeyParams): Promise<GenerateKeyResponse> {
    const { key, expires } = await this.post<
      {
        key: string;
        expires: string | null;
      },
      {
        user_id?: string;
        team_id?: string;
        key_alias?: string;
        duration?: string;
        models?: string[];
        max_budget?: number;
        rpm_limit?: number;
        tpm_limit?: number;
      }
    >({
      path: '/key/generate',
      body: {
        user_id: userId,
        team_id: teamId,
        key_alias: keyAlias,
        duration: keyDuration,
        models: models,
        max_budget: maxBudget,
        rpm_limit: rpmLimit,
        tpm_limit: tpmLimit,
      },
    });

    return {
      key,
      expires,
    };
  }

  async updateKey({
    keyOrKeyHash,
    keyAlias,
    maxBudget,
    blocked,
  }: UpdateKeyParams) {
    await this.post<
      void,
      {
        key: string;
        key_alias?: string;
        max_budget?: number;
        blocked?: boolean;
      }
    >({
      path: '/key/update',
      body: {
        key: keyOrKeyHash,
        key_alias: keyAlias,
        max_budget: maxBudget,
        blocked,
      },
    });
  }

  async deleteKey({ keyOrKeyHashes, keyAliases }: DeleteKeyParams) {
    await this.post<
      void,
      {
        keys?: string[];
        key_aliases?: string[];
      }
    >({
      path: '/key/delete',
      body: {
        keys: keyOrKeyHashes,
        key_aliases: keyAliases,
      },
    });
  }

  async getKey({ keyOrKeyHash }: GetKeyParams): Promise<Key | null> {
    let keyInfo;

    try {
      keyInfo = await this.get<
        {
          key: string;
          info: {
            key_name: string;
            key_alias: string | null;
            spend: number;
            expires: string | null;
            models: string[];
            user_id: string;
            team_id: string | null;
            rpm_limit: number | null;
            tpm_limit: number | null;
            budget_id: string | null;
            max_budget: number | null;
            budget_duration: string | null;
            budget_reset_at: string | null;
            blocked: boolean | null;
            created_at: string;
          };
        },
        {
          key: string;
        }
      >({
        path: '/key/info',
        query: {
          key: keyOrKeyHash,
        },
      });
    } catch (e: unknown) {
      if (e instanceof AxiosError && e.status === 404) {
        return null;
      }

      throw e;
    }

    return {
      keyOrKeyHash: keyInfo.key,
      keyName: keyInfo.info.key_name,
      keyAlias: keyInfo.info.key_alias,
      spend: keyInfo.info.spend,
      expires: keyInfo.info.expires,
      models: keyInfo.info.models,
      userId: keyInfo.info.user_id,
      teamId: keyInfo.info.team_id,
      rpmLimit: keyInfo.info.rpm_limit,
      tpmLimit: keyInfo.info.tpm_limit,
      budgetId: keyInfo.info.budget_id,
      maxBudget: keyInfo.info.max_budget,
      budgetDuration: keyInfo.info.budget_duration,
      budgetResetAt: keyInfo.info.budget_reset_at,
      blocked: keyInfo.info.blocked,
      createdAt: keyInfo.info.created_at,
    };
  }

  async listKeys({
    userId,
    page,
    pageSize = 10,
    sortBy = 'created_at',
    sortOrder = 'desc',
  }: ListKeysParams): Promise<ListKeysResponse> {
    const { keys, total_count, current_page, total_pages } = await this.get<
      {
        keys: string[];
        total_count: number;
        current_page: number;
        total_pages: number;
      },
      {
        user_id?: string;
        page?: number;
        size?: number;
        team_id?: string;
        sort_by?: string;
        sort_order?: 'asc' | 'desc';
      }
    >({
      path: '/key/list',
      query: {
        user_id: userId,
        page: page,
        size: pageSize,
        sort_by: sortBy,
        sort_order: sortOrder,
      },
    });

    return {
      keyHashes: keys,
      totalKeys: total_count,
      page: current_page,
      pageSize,
      totalPages: total_pages,
    };
  }

  async getSpendLogs({
    userId,
    keyOrKeyHash,
    startDate,
    endDate,
  }: GetSpendLogsParams): Promise<SpendLog[]> {
    const logs = await this.get<
      {
        request_id: string;
        user: string;
        api_key: string;
        status: string;
        call_type: string;
        spend: number;
        prompt_tokens: number;
        completion_tokens: number;
        total_tokens: number;
        model_id: string;
        model_group: string;
        startTime: string;
        endTime: string;
      }[],
      {
        user_id?: string;
        api_key?: string;
        start_date?: string;
        end_date?: string;
        summarize?: boolean;
      }
    >({
      path: '/spend/logs',
      query: {
        user_id: userId,
        api_key: keyOrKeyHash,
        start_date: startDate,
        end_date: endDate,
        summarize: false,
      },
    });

    return logs.map((log) => {
      return {
        requestId: log.request_id,
        userId: log.user,
        keyHash: log.api_key,
        status: log.status,
        callType: log.call_type,
        spend: log.spend,
        promptTokens: log.prompt_tokens,
        completionTokens: log.completion_tokens,
        totalTokens: log.total_tokens,
        modelId: log.model_id,
        modelGroup: log.model_group,
        startTime: log.startTime,
        endTime: log.endTime,
      };
    });
  }

  async chatCompletions(
    params: OpenAI.ChatCompletionCreateParams,
  ): Promise<OpenAI.ChatCompletion | stream.Readable> {
    return this.post({
      path: '/chat/completions',
      body: params,
      responseType: params.stream ? 'stream' : undefined,
    });
  }

  async models(): Promise<OpenAI.PageResponse<OpenAI.Model>> {
    return this.get({
      path: 'models',
    });
  }
}

export function createLitellmApiClient(
  apiKey: string,
  apiUrl = config.litellm.apiUrl,
): LitellmApiClient {
  return new LitellmApiClient({
    apiUrl,
    apiKey,
  });
}

export const adminLitellmApiClient = createLitellmApiClient(
  config.litellm.adminKey,
);
