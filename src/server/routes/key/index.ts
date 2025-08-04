import express from 'express';
import { generateKey } from './generate-key';
import { deleteKey } from './delete-key';
import { getKey } from './get-key';
import { getKeys } from './get-keys';

export const keyRouter = express.Router();

keyRouter.post('/generate', generateKey);
keyRouter.post('/delete', deleteKey);
keyRouter.get('/info', getKey);
keyRouter.get('/list', getKeys);
