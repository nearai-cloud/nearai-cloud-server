import axios, { Axios } from 'axios';
import {
  ApiClientOptions,
  GetOptions,
  PostOptions,
  RequestOptions,
} from '../types/api-client';
import { ApiErrorOptions } from '../types/api-client';
import * as v from 'valibot';

export class ApiError extends Error {
  type?: string;
  param?: string | null;
  code?: string | null;

  data: unknown;

  status?: number;

  isOpenAiCompatible: boolean;

  constructor(options: ApiErrorOptions, cause?: unknown) {
    const schema = v.object({
      error: v.object({
        message: v.string(),
        type: v.string(),
        param: v.nullable(v.string()),
        code: v.nullable(v.string()),
      }),
    });

    let data: v.InferOutput<typeof schema> | undefined;

    let isOpenAiCompatible;

    try {
      data = v.parse(schema, options.data);
      isOpenAiCompatible = true;
    } catch (e: unknown) {
      if (e instanceof v.ValiError) {
        data = undefined;
        isOpenAiCompatible = false;
      } else {
        throw e;
      }
    }

    super(data?.error.message, {
      cause,
    });

    this.type = data?.error.type;
    this.param = data?.error.param;
    this.code = data?.error.code;

    this.data = options.data;

    this.status = options.status;

    this.isOpenAiCompatible = isOpenAiCompatible;

    this.name = ApiError.name;
  }
}

export abstract class ApiClient {
  protected client: Axios;

  protected constructor({ apiUrl, apiKey }: ApiClientOptions) {
    this.client = axios.create({
      baseURL: apiUrl,
      headers: {
        authorization: `Bearer ${apiKey}`,
      },
    });
  }

  protected async request<T, P = unknown, B = unknown>(
    options: RequestOptions<P, B>,
  ): Promise<T> {
    try {
      const res = await this.client.request<T>({
        url: options.path,
        method: options.method,
        params: options.query,
        data: options.body,
        headers: options.headers,
        responseType: options.responseType,
      });

      return res.data;
    } catch (e) {
      if (axios.isAxiosError(e)) {
        throw new ApiError(
          {
            status: e.status,
            data: e.response?.data,
          },
          e,
        );
      }

      throw e;
    }
  }

  protected async get<T, P = unknown>(options: GetOptions<P>): Promise<T> {
    return this.request({
      ...options,
      method: 'get',
    });
  }

  protected async post<T, B = unknown>(options: PostOptions<B>): Promise<T> {
    return this.request({
      ...options,
      method: 'post',
    });
  }
}
