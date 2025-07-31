import {
  LightLLMOptions,
  RegisterUserParams,
  PostOptions,
  GetOptions,
  GenerateKeyParams,
  DeleteKeyParams,
  GenerateKeyResponse,
  ListKeysParams,
  ListKeysResponse,
  GetKeyInfoParams,
  GetKeyInfoResponse,
} from '../types/light-llm';
import { config } from '../config';
import axios, { AxiosResponse } from 'axios';

export class LightLLM {
  private readonly apiUrl: string;
  private readonly adminKey: string;

  constructor({ apiUrl, adminKey }: LightLLMOptions) {
    this.apiUrl = apiUrl;
    this.adminKey = adminKey;
  }

  private GET<T, P extends Record<string, unknown> = Record<string, unknown>>({
    path,
    params,
  }: GetOptions<P>): Promise<AxiosResponse<T>> {
    return axios.get(`${this.apiUrl}${path}`, {
      headers: {
        authorization: `Bearer ${this.adminKey}`,
      },
      params,
    });
  }

  private POST<T, B extends Record<string, unknown> = Record<string, unknown>>({
    path,
    body,
  }: PostOptions<B>): Promise<AxiosResponse<T>> {
    return axios.post(`${this.apiUrl}${path}`, body, {
      headers: {
        authorization: `Bearer ${this.adminKey}`,
      },
    });
  }

  async registerUser({ id, email }: RegisterUserParams) {
    await this.POST({
      path: '/user/new',
      body: {
        user_id: id,
        user_email: email,
        auto_create_key: false,
        user_role: 'internal_user_viewer',
      },
    });
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
    const res = await this.POST<
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
    await this.POST<{
      deleted_keys: string[];
    }>({
      path: '/key/delete',
      body: {
        keys: keyOrKeyHashes,
        key_aliases: keyAliases,
      },
    });
  }

  async getKeyInfo({
    keyOrKeyHash,
  }: GetKeyInfoParams): Promise<GetKeyInfoResponse> {
    const res = await this.GET<{
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
    }>({
      path: '/key/info',
      params: {
        key: keyOrKeyHash,
      },
    });

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
    pageSize,
    userId,
    teamId,
    sortBy,
    sortOrder,
  }: ListKeysParams): Promise<ListKeysResponse> {
    const res = await this.GET<
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
      totalPages: res.data.total_pages,
    };
  }
}

export const lightLLM = new LightLLM({
  apiUrl: config.lightLLM.apiUrl,
  adminKey: config.lightLLM.adminKey,
});
