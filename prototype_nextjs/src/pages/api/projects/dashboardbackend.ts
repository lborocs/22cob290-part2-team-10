import type { NextApiRequest, NextApiResponse } from 'next';
import { unstable_getServerSession } from 'next-auth/next';
import type { Prisma } from '@prisma/client';

import prisma from '~/lib/prisma';
import { whereEmployeeHasAccessToProject } from '~/lib/projects';
import type { ErrorResponse, SessionUser } from '~/types';
import { authOptions } from '~/pages/api/auth/[...nextauth]';
import ProjectsPage from '~/pages/projects';

export type ResponseSchema = Prisma.ProjectGetPayload<{
  select: {
    id: true;
    name: true;
    leader: true;
    leaderId: true;
    members: true;
    tasks: true;
  };
}>[];

/**
 * Get all projects the user has access to.
 * If the user is a manager, all projects are returned.
 * Otherwise, only projects the user has access to are returned.
 *
 * `Cache-Control: s-maxage=60, stale-while-revalidate=299`
 * (1 minute cache with 5 minutes stale-while-revalidate)
 *
 * @param req Request object. No body is required.
 * @param res Response object with a JSON body containing the projects. See {@link ResponseSchema}.
 * @example
 * ```ts
 * const { data: projects } = await axios.get('/api/projects/get-assigned-projects');
 * console.log(projects); // [{ id: 1, name: 'Project 1' }, { id: 2, name: 'Project 2' }]
 * ```
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseSchema | ErrorResponse>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const session = await unstable_getServerSession(req, res, authOptions);

  if (!session || !session.user) {
    return res.status(401).json({ error: 'You must be signed in.' });
  }

  const user = session.user as SessionUser;
  let projects: ResponseSchema;

  if (user.isManager) {
    projects = await prisma.project.findMany({
      select: {
        id: true,
        name: true,
        leader: true,
        leaderId: true,
        members: true,
        tasks: true,
      },
    });
  } else {
    projects = await prisma.project.findMany({
      where: whereEmployeeHasAccessToProject(user.id),
      select: {
        id: true,
        name: true,
        leader: true,
        leaderId: true,
        members: true,
        tasks: true,
      },
    });
  }

  res
    .setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=299')
    .status(200)
    .json(projects);
}
