import express from 'express';
import { chatCompletions } from './chat-completions';
import { models } from './models';

export const openaiRouter = express.Router();

openaiRouter.post('/chat/completions', chatCompletions);
openaiRouter.get('/models', models);
