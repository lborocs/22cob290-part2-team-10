import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '~/pages/api/auth/[...nextauth]';
import prisma from '~/lib/prisma';
import type { PostTopic } from '@prisma/client';
import type { ErrorResponse } from '~/types';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ErrorResponse | PostTopic[]>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const session = await getServerSession(req, res, authOptions);

  if (!session || !session.user) {
    return res.status(401).json({ error: 'You must be signed in.' });
  }

  const topics = await prisma.postTopic.findMany();

  res.status(200).json(topics);
}
