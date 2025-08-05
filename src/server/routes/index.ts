import express from 'express';
import { notFoundMiddleware } from '../middlewares/not-found';
import { ping } from './ping';
import { userRouter } from './user';
import { keyRouter } from './key';
import { apiRouter } from './api';
import { spendRouter } from './spend';

// TODO: Need Fix: Currently 405 Method Not Allowed will be considered as 404 Not Found
export const router = express.Router();

router.get('/', ping);
router.use('/user', userRouter);
router.use('/key', keyRouter);
router.use('/api', apiRouter);
router.use('/spend', spendRouter);

router.use(notFoundMiddleware);
