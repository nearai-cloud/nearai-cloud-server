import {
  LightLLMOptions,
  RegisterUserParams,
  GenerateKeyParams,
  DeleteKeyParams,
  GenerateKeyResponse,
  ListKeysParams,
  ListKeysResponse,
  User,
  Key,
  LightLLMErrorOptions,
  LightLLMRequestOptions,
  LightLLMGetOptions,
  LightLLMPostOptions,
} from '../types/light-llm';
import { config } from '../config';
import axios, { Axios, AxiosError, AxiosResponse } from 'axios';

export class LightLLMError extends Error {
  type: string;
  param: string;
  code: string;

  constructor(options: LightLLMErrorOptions, cause?: unknown) {
    super(options.error.message, {
      cause,
    });

    this.type = options.error.type;
    this.param = options.error.param;
    this.code = options.error.code;

    this.name = LightLLMError.name;
  }
}

export class LightLLM {
  private api: Axios;

  constructor({ apiUrl, adminKey }: LightLLMOptions) {
    this.api = axios.create({
      baseURL: apiUrl,
      headers: {
        authorization: `Bearer ${adminKey}`,
      },
    });
  }

  private async request<T, P = unknown, B = unknown>(
    options: LightLLMRequestOptions<P, B>,
  ): Promise<AxiosResponse<T>> {
    try {
      return await this.api.request({
        url: options.path,
        method: options.method,
        params: options.params,
        data: options.body,
        headers: options.headers,
      });
    } catch (e: unknown) {
      if (e instanceof AxiosError && e.response?.data) {
        throw new LightLLMError(e.response.data, e);
      }

      throw e;
    }
  }

  private async get<T, P = unknown>(
    options: LightLLMGetOptions<P>,
  ): Promise<AxiosResponse<T>> {
    return this.request({
      ...options,
      method: 'GET',
    });
  }

  private async post<T, B = unknown>(
    options: LightLLMPostOptions<B>,
  ): Promise<AxiosResponse<T>> {
    return this.request({
      ...options,
      method: 'POST',
    });
  }

  async registerUser({ userId, teamId, userEmail }: RegisterUserParams) {
    await this.post({
      path: '/user/new',
      body: {
        user_id: userId,
        team_id: teamId,
        user_email: userEmail,
        auto_create_key: false,
        user_role: 'internal_user_viewer',
      },
    });
  }

  async getUser(userId: string): Promise<User | null> {
    const res = await this.get<{
      user_info: {
        user_id?: string;
        team_id: string | null;
        user_email: string | null;
      };
    }>({
      path: '/user/info',
      params: {
        user_id: userId,
      },
    });

    if (!res.data.user_info.user_id) {
      return null;
    }

    return {
      userId: res.data.user_info.user_id,
      teamId: res.data.user_info.team_id,
      userEmail: res.data.user_info.user_email,
    };
  }

  async generateKey({
    userId,
    teamId,
    keyAlias,
    keyDuration,
    models,
    maxBudget,
    budgetDuration,
    rpmLimit,
    tpmLimit,
  }: GenerateKeyParams): Promise<GenerateKeyResponse> {
    const res = await this.post<
      {
        key: string;
        expires: string | null;
      },
      {
        user_id: string;
        team_id?: string;
        key_alias?: string;
        duration?: string;
        models?: string[];
        max_budget?: number;
        budget_duration?: string;
        rpm_limit?: number;
        tpm_limit?: number;
        tags?: string[];
        allowed_routes?: string[];
        blocked?: boolean;
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
        budget_duration: budgetDuration,
        rpm_limit: rpmLimit,
        tpm_limit: tpmLimit,
      },
    });

    return {
      key: res.data.key,
      expires: res.data.expires,
    };
  }

  async deleteKey({ keyOrKeyHashes, keyAliases }: DeleteKeyParams) {
    await this.post<{
      deleted_keys: string[];
    }>({
      path: '/key/delete',
      body: {
        keys: keyOrKeyHashes,
        key_aliases: keyAliases,
      },
    });
  }

  async getKey(keyOrKeyHash: string): Promise<Key | null> {
    let res: AxiosResponse<{
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
      };
    }>;

    try {
      res = await this.get({
        path: '/key/info',
        params: {
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
      keyOrKeyHash: res.data.key,
      keyName: res.data.info.key_name,
      keyAlias: res.data.info.key_alias,
      spend: res.data.info.spend,
      expires: res.data.info.expires,
      models: res.data.info.models,
      userId: res.data.info.user_id,
      teamId: res.data.info.team_id,
      rpmLimit: res.data.info.rpm_limit,
      tpmLimit: res.data.info.tpm_limit,
      budgetId: res.data.info.budget_id,
      maxBudget: res.data.info.max_budget,
      budgetDuration: res.data.info.budget_duration,
      budgetResetAt: res.data.info.budget_reset_at,
    };
  }

  async listKeys({
    page,
    pageSize = 10,
    userId,
    teamId,
    sortBy,
    sortOrder,
  }: ListKeysParams = {}): Promise<ListKeysResponse> {
    const res = await this.get<
      {
        keys: string[];
        total_count: number;
        current_page: number;
        total_pages: number;
      },
      {
        page?: number;
        size?: number;
        user_id?: string;
        team_id?: string;
        sort_by?: string;
        sort_order?: 'asc' | 'desc';
      }
    >({
      path: '/key/list',
      params: {
        page: page,
        size: pageSize,
        user_id: userId,
        team_id: teamId,
        sort_by: sortBy ?? 'created_at',
        sort_order: sortOrder ?? 'desc',
      },
    });

    return {
      keyHashes: res.data.keys,
      totalKeys: res.data.total_count,
      page: res.data.current_page,
      pageSize,
      totalPages: res.data.total_pages,
    };
  }
}

export const lightLLM = new LightLLM({
  apiUrl: config.lightLLM.apiUrl,
  adminKey: config.lightLLM.adminKey,
});
