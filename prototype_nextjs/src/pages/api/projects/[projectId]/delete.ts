import { PrismaClient, Prisma } from '@prisma/client';
import prisma from '~/lib/prisma';

export default async function handler(req, res) {
  const { projectId } = req.query;

  const id = parseInt(projectId);

  const tasks = await prisma.projectTask.findMany({
    where: { projectId: id },
  });

  if (tasks.length > 0) {
    await prisma.projectTask.deleteMany({
      where: { projectId: id },
    });
  }

  await prisma.project.delete({ where: { id } });

  res.status(200).json({ message: 'Project deleted successfully' });
}
