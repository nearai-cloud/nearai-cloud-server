import express from 'express';
import { createTeam } from './create-team';
import { updateTeam } from './update-team';
import { listTeams } from './list-teams';

export const teamRouter = express.Router();

teamRouter.post('/new', createTeam);
teamRouter.post('/update', updateTeam);
teamRouter.get('/list', listTeams);
