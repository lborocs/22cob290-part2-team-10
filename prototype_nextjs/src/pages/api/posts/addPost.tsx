import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '~/pages/api/auth/[...nextauth]';
import prisma from '~/lib/prisma';
import type { SessionUser } from '~/types';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const session = await getServerSession(req, res, authOptions);

  if (!session || !session.user) {
    return res.status(401).json({ error: 'You must be signed in.' });
  }

  const user = session.user as SessionUser;
  const { title, topics, content, summary } = req.body;
  const post = await prisma.post.create({
    data: {
      author: { connect: { id: user.id } },
      topics: {
        connectOrCreate: topics.map((topic: string) => ({
          where: { name: topic },
          create: { name: topic },
        })),
      },
      history: {
        create: {
          title,
          content,
          summary,
          editor: {
            connect: { id: user.id },
          },
        },
      },
    },
    select: {
      id: true,
      authorId: true,
      author: true,
      topics: true,
      // using to check if upvoted by this user
      upvoters: {
        where: {
          id: user.id,
        },
        select: {
          id: true,
        },
      },
      _count: {
        select: {
          // using to get the number of upvotes
          upvoters: true,
        },
      },
      history: {
        include: {
          editor: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });

  const postWithInfo = {
    ...post,
    upvotedByMe: post.upvoters.length > 0,
    upvoters: post._count.upvoters,
  };

  res.status(200).json(postWithInfo);
}
