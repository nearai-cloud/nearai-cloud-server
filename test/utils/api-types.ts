import * as v from 'valibot';
import { outputSchema as getUserOutputSchema } from '../../src/server/routes/user/get-user';

export type GetUserOptions = {
  authorization: string;
};

export type GetUserOutput = v.InferOutput<typeof getUserOutputSchema>;
