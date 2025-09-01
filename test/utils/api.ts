import { Agent } from 'supertest';
import { GetUserOptions, GetUserOutput } from './api-types';
import { STATUS_CODES } from '../../src/utils/consts';

export async function getUser(
  agent: Agent,
  options: GetUserOptions,
): Promise<GetUserOutput> {
  const res = await agent
    .get('/user/info')
    .auth(options.authorization, { type: 'bearer' });
  if (res.status !== STATUS_CODES.OK) {
    throw Error(JSON.stringify(res.body));
  }
  return res.body;
}
