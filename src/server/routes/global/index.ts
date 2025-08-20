import express from 'express';
import { getTagDailyActivity } from './get-tag-daily-activity';

export const globalRouter = express.Router();

globalRouter.get('/tag/daily/activity', getTagDailyActivity);
