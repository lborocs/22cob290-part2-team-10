import { NextApiRequest, NextApiResponse } from 'next';

import prisma from '~/lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const data = JSON.parse(req.body);

  const createUserTask = await prisma.userTask.create({
    data: {
      user: {
        connect: {
          id: data.userid,
        },
      },
      stage: data.stage,
      title: data.title,
      description: data.description,
      deadline: data.deadline,
      tags: data.tags,
    },
  });

  res.json(createUserTask);
}
