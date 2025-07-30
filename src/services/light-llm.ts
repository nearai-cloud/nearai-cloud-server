import {
  LightLLMOptions,
  CreateUserParams,
  PostOptions,
  GetOptions,
  CreateKeyParams,
} from '../types/light-llm';
import { config } from '../config';
import axios from 'axios';

export class LightLLM {
  private readonly apiUrl: string;
  private readonly adminKey: string;

  constructor({ apiUrl, adminKey }: LightLLMOptions) {
    this.apiUrl = apiUrl;
    this.adminKey = adminKey;
  }

  private GET({ path, params }: GetOptions) {
    return axios.get(`${this.apiUrl}${path}`, {
      headers: {
        authorization: `Bearer ${this.adminKey}`,
      },
      params,
    });
  }

  private POST({ path, body }: PostOptions) {
    return axios.post(`${this.apiUrl}${path}`, body, {
      headers: {
        authorization: `Bearer ${this.adminKey}`,
      },
    });
  }

  async registerUser({ id, email }: CreateUserParams) {
    await this.POST({
      path: '/user/new',
      body: {
        user_id: id,
        user_email: email,
        auto_create_key: false,
        user_role: 'internal_user_viewer',
      },
    });
  }

  async generateKey({ userId, alias }: CreateKeyParams) {
    await this.POST({
      path: '/key/generate',
      body: {
        user_id: userId,
        key_alias: alias,
        models: ['all-team-models'],
        team_id: undefined, // TODO: Specify a team id
      },
    });
  }
}

export const lightLLM = new LightLLM({
  apiUrl: config.lightLLM.apiUrl,
  adminKey: config.lightLLM.adminKey,
});
