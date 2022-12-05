import type { NextApiRequest, NextApiResponse } from 'next';
import { unstable_getServerSession } from 'next-auth/next';

import { getInviteToken } from '~/lib/inviteToken';
import type { UnauthorisedResponse } from '~/types';
import { authOptions } from '~/pages/api/auth/[...nextauth]';

export type ResponseSchema = { inviteUrl: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseSchema | UnauthorisedResponse | { error: string }>,
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const session = await unstable_getServerSession(req, res, authOptions);

  if (!session || !session.user) {
    return res.status(401).json({ message: 'You must be signed in.' });
  }

  const email = session.user.email!;

  const token = getInviteToken(email);

  const url = process.env.NEXTAUTH_URL as string;

  res.status(200).json({
    inviteUrl: `${url}/signup?invite=${token}`,
  });
}
