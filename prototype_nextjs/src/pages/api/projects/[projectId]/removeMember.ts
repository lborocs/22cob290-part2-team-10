import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '~/lib/prisma';

interface RemoveMemberRequestBody {
  memberId: number;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const projectId = parseInt(req.query.projectId as string);
  const { memberId } = req.body as RemoveMemberRequestBody;

  // Find the project and the user to remove
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: { members: true },
  });
  const user = await prisma.user.findUnique({
    where: { id: memberId.toString() },
  });

  if (!project || !user) {
    return res.status(404).json({ message: 'Project or user not found' });
  }

  // Check if the user is a member of the project
  const isMember = project.members.some((m) => m.id === memberId.toString());
  if (!isMember) {
    return res
      .status(400)
      .json({ message: 'User is not a member of the project' });
  }

  // Remove the user from the project
  const updatedProject = await prisma.project.update({
    where: { id: projectId },
    data: {
      members: {
        disconnect: { id: memberId.toString() },
      },
    },
    include: { members: true },
  });

  res.status(200).json(updatedProject);
}
