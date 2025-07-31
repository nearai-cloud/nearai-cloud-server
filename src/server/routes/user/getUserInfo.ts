import { RequestHandler } from 'express';
import ctx from 'express-http-context';
import { lightLLM } from '../../../services/light-llm';
import { CTX_KEYS } from '../../../utils/consts';
import { Auth, auth } from '../../middlewares/auth';

const resolver: RequestHandler = async (req, res) => {
  const { user }: Auth = ctx.get(CTX_KEYS.AUTH);

  const { userInfo } = await lightLLM.getUserInfo({
    userId: user.id,
  });

  if (userInfo) {
    res.json({
      userId: userInfo.userId,
      userEmail: userInfo.userEmail,
    });
  } else {
    res.json(null);
  }
};

export const getUserInfo: RequestHandler[] = [auth, resolver];
