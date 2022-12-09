import type { NextApiRequest, NextApiResponse } from 'next';
import { unstable_getServerSession } from 'next-auth/next';
import type { Prisma } from '@prisma/client';

import prisma from '~/lib/prisma';
import { whereEmployeeHasAccessToProject } from '~/lib/projects';
import type { ErrorResponse, SessionUser } from '~/types';
import { authOptions } from '~/pages/api/auth/[...nextauth]';

export type ResponseSchema = Prisma.ProjectGetPayload<{
  select: {
    id: true,
    name: true,
  },
}>[];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseSchema | ErrorResponse>,
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const session = await unstable_getServerSession(req, res, authOptions);

  if (!session || !session.user) {
    return res.status(401).json({ error: 'You must be signed in.' });
  }

  const user = (session.user as SessionUser);

  let projects: ResponseSchema;

  if (user.isManager) {
    projects = await prisma.project.findMany({
      select: {
        id: true,
        name: true,
      },
    });
  } else {
    projects = await prisma.project.findMany({
      where: whereEmployeeHasAccessToProject(user.id),
      select: {
        id: true,
        name: true,
      },
    });
  }

  res.status(200).json(projects);
}
