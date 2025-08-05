import express from 'express';
import { chatCompletions } from './chat-completions';

export const apiRouter = express.Router();

apiRouter.post('/chat/completions', chatCompletions);
