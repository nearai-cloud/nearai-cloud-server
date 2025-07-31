import express from 'express';
import { registerUser } from './registerUser';
import { getUser } from './getUser';

export const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.get('/info', getUser);
