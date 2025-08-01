import express from 'express';
import { generateKey } from './generate-key';
import { getKey } from './get-key';
import { getKeys } from './get-keys';

export const keyRouter = express.Router();

keyRouter.post('/generate', generateKey);
keyRouter.get('/info', getKey);
keyRouter.get('/list', getKeys);
