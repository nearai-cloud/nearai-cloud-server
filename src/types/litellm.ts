export type LitellmClientErrorOptions = {
  error: {
    message: string;
    type: string;
    param: string;
    code: string;
  };
};

export type LitellmOptions = {
  apiUrl: string;
  apiKey: string;
};

export type LitellmRequestOptions<Q, B> = {
  path: string;
  method: 'get' | 'post';
  query?: Q;
  body?: B;
  headers?: Record<string, string | undefined>;
  responseType?: 'stream';
};

export type LitellmGetOptions<Q> = {
  path: string;
  query?: Q;
  headers?: Record<string, string | undefined>;
  responseType?: 'stream';
};

export type LitellmPostOptions<B> = {
  path: string;
  body?: B;
  headers?: Record<string, string | undefined>;
  responseType?: 'stream';
};

export type RegisterUserParams = {
  userId: string;
  userEmail?: string;
  autoCreateKey?: boolean;
};

export type GetUserParams = {
  userId: string;
};

export type User = {
  userId: string;
  userEmail: string | null;
  spend: number;
};

export type GenerateKeyParams = {
  userId: string;
  teamId?: string;
  keyAlias?: string;
  keyDuration?: string; // e.g. 30s 30m 30h 30d
  models?: string[];
  maxBudget?: number;
  rpmLimit?: number;
  tpmLimit?: number;
};

export type GenerateKeyResponse = {
  key: string;
  expires: string | null; // ISO string
};

export type UpdateKeyParams = {
  keyOrKeyHash: string;
  keyAlias?: string;
  maxBudget?: number;
  blocked?: boolean;
};

export type DeleteKeyParams = {
  keyOrKeyHashes?: string[];
  keyAliases?: string[];
};

export type GetKeyParams = {
  keyOrKeyHash: string;
};

export type Key = {
  keyOrKeyHash: string;
  keyName: string; // Simplified key string. e.g. sk-...ABcd
  keyAlias: string | null;
  spend: number;
  expires: string | null;
  models: string[];
  userId: string | null;
  teamId: string | null;
  rpmLimit: number | null;
  tpmLimit: number | null;
  budgetId: string | null;
  maxBudget: number | null;
  budgetDuration: string | null;
  budgetResetAt: string | null;
  blocked: boolean | null;
  createdAt: string;
};

export type ListKeysParams = {
  userId: string;
  page?: number; // Min: 1
  pageSize?: number; // Min: 1 Max: 100
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
};

export type ListKeysResponse = {
  keyHashes: string[];
  totalKeys: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

export type GetSpendLogsParams = {
  userId: string;
  keyOrKeyHash?: string;
  startDate?: string;
  endDate?: string;
};

export type SpendLog = {
  requestId: string;
  userId: string;
  keyHash: string;
  status: string;
  callType: string;
  spend: number;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  modelId: string;
  modelGroup: string;
  startTime: string;
  endTime: string;
};
