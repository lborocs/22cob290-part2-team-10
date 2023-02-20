import prisma from '~/lib/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';
import { unstable_getServerSession } from 'next-auth/next';

import { authOptions } from '~/pages/api/auth/[...nextauth]';

export default async function updatevalue(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const session = await unstable_getServerSession(req, res, authOptions);

  if (!session || !session.user) {
    return res.status(401).json({ error: 'You must be signed in.' });
  }

  await prisma.user.update({
    where: {
      email: req.body.email as string,
    },
    data: {
      leftCompany: req.body.leftCompany,
    },
  });
  res.status(200).json({ success: true });
}
