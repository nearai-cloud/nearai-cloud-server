import express from 'express';
import { generateKey } from './generateKey';

export const keyRouter = express.Router();

keyRouter.post('/generate', generateKey);
