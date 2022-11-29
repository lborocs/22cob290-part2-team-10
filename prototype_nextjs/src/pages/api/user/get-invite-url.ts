import type { NextApiRequest, NextApiResponse } from 'next';
import { unstable_getServerSession } from 'next-auth/next';

import type { UnauthorisedResponse } from '~/types';
import { authOptions } from '~/pages/api/auth/[...nextauth]';
import { getInviteToken } from '~/server/inviteToken';

export type ResponseSchema = { inviteUrl: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<UnauthorisedResponse | ResponseSchema>,
) {
  const session = await unstable_getServerSession(req, res, authOptions);

  if (!session || !session.user) {
    res.status(401).json({ message: 'You must be logged in.' });
    return;
  }

  const email = session.user.email!;

  const token = getInviteToken(email);

  const url = process.env.NEXTAUTH_URL as string;

  res.status(200).json({
    inviteUrl: `${url}/signup?invite=${token}`,
  });
}
