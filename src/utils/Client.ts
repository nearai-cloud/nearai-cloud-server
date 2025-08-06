import axios, { Axios } from 'axios';

export abstract class Client {
  protected api: Axios;

  protected constructor({ apiUrl, apiKey }: ClientOptions) {
    this.api = axios.create({
      baseURL: apiUrl,
      headers: {
        authorization: `Bearer ${apiKey}`,
      },
    });
  }

  protected async request<T, P = unknown, B = unknown>(
    options: RequestOptions<P, B>,
  ): Promise<T> {
    const res = await this.api.request<T>({
      url: options.path,
      method: options.method,
      params: options.query,
      data: options.body,
      headers: options.headers,
      responseType: options.responseType,
    });

    return res.data;
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

export type ClientOptions = {
  apiUrl: string;
  apiKey: string;
};

export type RequestOptions<Q, B> = {
  path: string;
  method: 'get' | 'post';
  query?: Q;
  body?: B;
  headers?: Record<string, string | undefined>;
  responseType?: 'stream';
};

export type GetOptions<Q> = {
  path: string;
  query?: Q;
  headers?: Record<string, string | undefined>;
  responseType?: 'stream';
};

export type PostOptions<B> = {
  path: string;
  body?: B;
  headers?: Record<string, string | undefined>;
  responseType?: 'stream';
};
