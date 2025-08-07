export type ThrowHttpErrorOptions = {
  status?: number;
  cause?: unknown;
  message?: string;
};

export type OpenAiCompatibleErrorOptions = {
  status: number;
  error: {
    message: string;
    type: string;
    param: string | null;
    code: string | null;
  };
  cause?: unknown;
};
