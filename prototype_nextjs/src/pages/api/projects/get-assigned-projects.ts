import type { NextApiRequest, NextApiResponse } from 'next';
import { unstable_getServerSession } from 'next-auth/next';

import prisma from '~/lib/prisma';
import { whereUserHasAccessToProject } from '~/lib/projects';
import type { UnauthorisedResponse, SessionUser } from '~/types';
import { authOptions } from '~/pages/api/auth/[...nextauth]';

// TODO: return this user's role? (computed value)
async function getProjects(userId: string) {
  const projects = await prisma.project.findMany({
    where: {
      ...whereUserHasAccessToProject(userId),
    },
    select: {
      id: true,
      name: true,
    },
  });

  return projects;
}

export type ResponseSchema = Awaited<ReturnType<typeof getProjects>>;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseSchema | UnauthorisedResponse | { error: string }>,
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const session = await unstable_getServerSession(req, res, authOptions);

  if (!session || !session.user) {
    return res.status(401).json({ message: 'You must be signed in.' });
  }

  const userId = (session.user as SessionUser).id;

  const projects = await getProjects(userId);

  res.status(200).json(projects);
}
