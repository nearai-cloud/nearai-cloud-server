export type LitellmErrorOptions = {
  error: {
    message: string;
    type: string;
    param: string;
    code: string;
  };
};

export type LitellmOptions = {
  apiUrl: string;
  adminKey: string;
};

export type LitellmRequestOptions<P, B> = {
  path: Path;
  method: 'GET' | 'POST';
  params?: P;
  body?: B;
  headers?: Record<string, string | undefined>;
};

export type LitellmGetOptions<P> = {
  path: Path;
  params?: P;
  headers?: Record<string, string | undefined>;
};

export type LitellmPostOptions<B> = {
  path: Path;
  body?: B;
  headers?: Record<string, string | undefined>;
};

export type Path = `/${string}`;

export type RegisterUserParams = {
  userId: string;
  teamId?: string;
  userEmail?: string;
};

export type User = {
  userId: string;
  teamId: string | null;
  userEmail: string | null;
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
};

export type ListKeysParams = {
  page?: number; // Min: 1
  pageSize?: number; // Min: 1 Max: 100
  userId?: string;
  teamId?: string;
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
