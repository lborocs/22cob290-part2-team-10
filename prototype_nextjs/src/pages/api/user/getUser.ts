import type { NextApiRequest, NextApiResponse } from 'next';
import { unstable_getServerSession } from 'next-auth/next';

import { authOptions } from '~/pages/api/auth/[...nextauth]';
import type { User } from '~/types';
import { users } from '~/server/store/users';

type FailedResponse = {
  message: string
};

export type UserInfo = (Omit<User, 'password'> & {
  name: string
});

export type ResponseSchema = FailedResponse | UserInfo;

export function getUser(email: string): UserInfo | undefined {
  const user = users.find((user) => user.email === email);

  if (!user) return user;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, ...result } = user;

  return {
    name: `${user.fname} ${user.lname}`,
    ...result,
  };
}

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

  const user = getUser(email);

  if (!user) { // SHOULD NOT HAPPEN
    res.status(401).json({
      message: 'You do not have an account.',
    });
    return;
  }

  res.status(200).json(user);
}
