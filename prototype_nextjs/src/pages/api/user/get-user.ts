import type { NextApiRequest, NextApiResponse } from 'next';
import { unstable_getServerSession } from 'next-auth/next';

import { authOptions } from '~/pages/api/auth/[...nextauth]';
import { getUserInfo, type UserInfo } from '~/server/store/users';

type FailedResponse = {
  message: string
};

export type ResponseSchema = FailedResponse | UserInfo;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseSchema>,
) {
  const session = await unstable_getServerSession(req, res, authOptions);

  if (!session || !session.user) {
    res.status(401).json({ message: 'You must be logged in.' });
    return;
  }

  const email = session.user.email!;

  const user = await getUserInfo(email);

  if (!user) { // SHOULD NOT HAPPEN
    res.status(401).json({
      message: 'You do not have an account.',
    });
    return;
  }

  res.status(200).json(user);
}
