export type LightLLMOptions = {
  apiUrl: string;
  adminKey: string;
};

export type GetOptions = {
  path: Path;
  params: Record<string, unknown>;
};

export type PostOptions = {
  path: Path;
  body: Record<string, unknown>;
};

export type Path = `/${string}`;

export type CreateUserParams = {
  id: string;
  email?: string;
};
