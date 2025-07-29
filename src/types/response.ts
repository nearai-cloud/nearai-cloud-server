export type ErrorResponseBody = {
  error: {
    status: number;
    message: string;
    stack?: string;
  };
};
