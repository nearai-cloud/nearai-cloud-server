import express from 'express';
import { register } from './register';
import { sessionAuth } from '../auth';

export const userRouter = express.Router();

userRouter.post('/register', sessionAuth, register);
