import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '~/lib/prisma';

interface UpdateProjectTitleRequest extends NextApiRequest {
  query: {
    projectId: string;
  };
  body: {
    title: string;
  };
}

export default async function handler(
  req: UpdateProjectTitleRequest,
  res: NextApiResponse
) {
  const projectId = parseInt(req.query.projectId);
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
