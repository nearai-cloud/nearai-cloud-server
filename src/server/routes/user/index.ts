import express from 'express';
import { registerUser } from './register-user';
import { supabaseAuth } from '../auth';

export const userRouter = express.Router();

userRouter.post('/', supabaseAuth, registerUser);
