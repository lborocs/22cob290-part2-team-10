import { NextApiRequest, NextApiResponse } from 'next';

import prisma from '~/lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const data = JSON.parse(req.body);

  const changeTaskStage = await prisma.userTask.update({
    where: {
      id: data.id,
    },
    data: {
      stage: data.stage,
    },
  });

  res.status(200).json(changeTaskStage);
}
