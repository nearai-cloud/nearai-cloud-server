import express, { RequestHandler } from 'express';

export const bodyParserMiddleware: RequestHandler = (req, res, next) => {
  if (req.path.includes('/completions')) {
    express.raw({ type: '*/*' })(req, res, next);
  } else {
    express.json()(req, res, next);
  }
};
