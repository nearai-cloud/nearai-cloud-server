import express from 'express';
import { userRouter } from './user';
import { ping } from './ping';
import { notFound } from './not-found';

export const router = express.Router();

router.get('/', ping);

router.use('/user', userRouter);

router.use(notFound);
