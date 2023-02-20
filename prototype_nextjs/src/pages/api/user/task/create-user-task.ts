import type { NextApiRequest, NextApiResponse } from 'next';
import type { UserTask } from '@prisma/client';

import prisma from '~/lib/prisma';

export type CreateUserTaskResponse = Omit<UserTask, 'deadline'> & {
  tags: string[];
} & {
  deadline: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CreateUserTaskResponse>
) {
  const data = req.body;

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
    include: {
      tags: true,
    },
  });

  res.json({
    ...createUserTask,
    deadline: createUserTask.deadline.toISOString(),
    tags: createUserTask.tags.map((tag) => tag.name),
  });
}
