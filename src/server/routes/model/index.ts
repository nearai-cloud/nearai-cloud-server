import express from 'express';
import { createModel } from './create-model';
import { updateModel } from './update-model';
import { getModel } from './get-model';
import { listModels } from './list-models';

export const modelRouter = express.Router();

modelRouter.post('/new', createModel);
modelRouter.post('/update', updateModel);
modelRouter.get('/info', getModel);
modelRouter.get('/list', listModels);
