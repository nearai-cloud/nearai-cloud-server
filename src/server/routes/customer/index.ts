import express from 'express';
import { getCustomer } from './get-customer';
import { listCustomers } from './list-customers';
import { newCustomer } from './new-customer';
import { updateCustomer } from './update-customer';

export const customerRouter = express.Router();

customerRouter.post('/new', newCustomer);
customerRouter.get('/info', getCustomer);
customerRouter.post('/update', updateCustomer);
customerRouter.get('/list', listCustomers);
