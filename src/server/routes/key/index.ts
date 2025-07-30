import express from 'express';
import { generate } from './generate';
import { sessionAuth } from '../auth';

export const keyRouter = express.Router();

keyRouter.post('/generate', sessionAuth, generate);
