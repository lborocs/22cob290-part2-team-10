import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '~/lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const projectId = parseInt(req.query.projectId as string);
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
