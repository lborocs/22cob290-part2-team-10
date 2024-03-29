import type { NextApiRequest, NextApiResponse } from 'next';

import prisma from '~/lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const data = req.body;

  const changeTaskStage = await prisma.projectTask.update({
    where: {
      id: data.id,
    },
    data: {
      stage: data.stage,
    },
  });

  res.json(changeTaskStage);
}
