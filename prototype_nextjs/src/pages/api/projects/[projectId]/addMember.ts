import { PrismaClient } from '@prisma/client';
import prisma from '~/lib/prisma';

export default async function handler(req, res) {
  const projectId = parseInt(req.query.projectId, 10);
  const { memberId } = req.body;

  // Find the project and the user to add
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: { members: true },
  });
  const user = await prisma.user.findUnique({
    where: { id: memberId },
  });

  if (!project || !user) {
    return res.status(404).json({ message: 'Project or user not found' });
  }

  // Check if the user is already a member of the project
  const isMember = project.members.some((m) => m.id === memberId);
  if (isMember) {
    return res
      .status(400)
      .json({ message: 'User is already a member of the project' });
  }

  // Add the user to the project
  const updatedProject = await prisma.project.update({
    where: { id: projectId },
    data: {
      members: {
        connect: { id: memberId },
      },
    },
    include: { members: true },
  });

  res.status(200).json(updatedProject);
}
