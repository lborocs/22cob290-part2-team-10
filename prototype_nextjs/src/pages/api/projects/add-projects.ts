import { PrismaClient } from '@prisma/client';
import prisma from '~/lib/prisma';

export default async (req, res) => {
  const data = JSON.parse(req.body);

  const createdProject = await prisma.project.create({
    data,
  });

  res.json(createdProject);
};
