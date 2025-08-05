import express from 'express';
import { chatCompletions } from './chat-completions';
import { models } from './models';

export const apiRouter = express.Router();

apiRouter.post('/chat/completions', chatCompletions);
apiRouter.get('/models', models);
