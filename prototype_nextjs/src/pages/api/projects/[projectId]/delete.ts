import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '~/lib/prisma';

interface DeleteProjectQuery {
  [key: string]: string | string[];
  projectId: string;
}
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { projectId } = req.query as DeleteProjectQuery;
  const id = parseInt(projectId);

  await prisma.projectTask.deleteMany({
    where: { projectId: id },
  });

  await prisma.project.delete({ where: { id } });

  res.status(200).json({ message: 'Project deleted successfully' });
}
