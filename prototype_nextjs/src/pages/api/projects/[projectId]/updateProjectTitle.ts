import { PrismaClient } from '@prisma/client';
import prisma from '~/lib/prisma';

export default async function handler(req, res) {
  const projectId = parseInt(req.query.projectId, 10);
  const { title } = req.body;

  // Update the project title
  const updatedProject = await prisma.project.update({
    where: { id: projectId },
    data: {
      name: title,
    },
  });

  res.status(200).json(updatedProject);
}
