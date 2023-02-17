import { PrismaClient } from '@prisma/client';
import prisma from '~/lib/prisma';

export default async function handler(req, res) {
  const projectId = parseInt(req.query.projectId, 10);
  const { newLeaderId } = req.body;

  // Find the project and the new leader
  const project = await prisma.project.findUnique({
    where: { id: projectId },
  });
  const newLeader = await prisma.user.findUnique({
    where: { id: newLeaderId },
  });

  if (!project || !newLeader) {
    return res.status(404).json({ message: 'Project or user not found' });
  }

  // Update the project with the new leader
  const updatedProject = await prisma.project.update({
    where: { id: projectId },
    data: {
      leaderId: newLeaderId,
    },
    include: { leader: true },
  });

  res.status(200).json(updatedProject);
}
