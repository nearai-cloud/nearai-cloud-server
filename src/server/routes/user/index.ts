import express from 'express';
import { registerUser } from './registerUser';
import { getUserInfo } from './getUserInfo';

export const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.get('/info', getUserInfo);
