import express from 'express';
import { registerUser } from './register-user';

export const userRouter = express.Router();

userRouter.post('/register', registerUser);
