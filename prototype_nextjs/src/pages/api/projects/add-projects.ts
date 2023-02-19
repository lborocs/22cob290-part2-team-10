import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import prisma from '~/lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { name, leaderId } = req.body;

  const project = await prisma.project.create({
    data: {
      name,
      leaderId,
    },
  });

  await prisma.$transaction([
    prisma.project.update({
      where: { id: project.id },
      data: {
        members: {
          connect: { id: leaderId },
        },
      },
    }),
  ]);

  res.status(200).json({ message: 'Project added successfully' });
}
