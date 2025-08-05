import express from 'express';
import { notFoundMiddleware } from '../middlewares/not-found';
import { ping } from './ping';
import { userRouter } from './user';
import { keyRouter } from './key';
import { openaiRouter } from './openai';

// TODO: Need Fix: Currently 405 Method Not Allowed will be considered as 404 Not Found
export const router = express.Router();

router.get('/', ping);
router.use('/user', userRouter);
router.use('/key', keyRouter);
router.use('/openai', openaiRouter);

router.use(notFoundMiddleware);
