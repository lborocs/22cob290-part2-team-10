import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '~/pages/api/auth/[...nextauth]';
import prisma from '~/lib/prisma';
import type { ErrorResponse, SessionUser } from '~/types';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ErrorResponse | { success: true }>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const session = await getServerSession(req, res, authOptions);

  if (!session || !session.user) {
    return res.status(401).json({ error: 'You must be signed in.' });
  }

  const userId = (session.user as SessionUser).id;
  const { postId, add } = req.body;

  await prisma.post.update({
    where: {
      id: postId,
    },
    data: {
      upvoters: {
        [add ? 'connect' : 'disconnect']: {
          id: userId,
        },
      },
    },
  });

  res.status(200).json({ success: true });
}
