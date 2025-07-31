import express from 'express';
import { register } from './register';

export const userRouter = express.Router();

userRouter.post('/register', register);
