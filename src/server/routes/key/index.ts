import express from 'express';
import { generateKey } from './generateKey';
import { getKey } from './getKey';

export const keyRouter = express.Router();

keyRouter.post('/generate', generateKey);
keyRouter.get('/info', getKey);
