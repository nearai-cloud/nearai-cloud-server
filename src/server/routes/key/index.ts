import express from 'express';
import { generate } from './generate';

export const keyRouter = express.Router();

keyRouter.post('/generate', generate);
