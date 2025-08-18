import express from 'express';
import { getTagDailyActivity } from './get-tag-daily-activity';
import { openaiRouter } from '../openai';

export const globalRouter = express.Router();

globalRouter.use('', openaiRouter);
globalRouter.use('/v1', openaiRouter);

globalRouter.get('/tag/daily/activity', getTagDailyActivity);
