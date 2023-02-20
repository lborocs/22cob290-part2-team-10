import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import type { Prisma } from '@prisma/client';

import prisma from '~/lib/prisma';
import { whereEmployeeHasAccessToProject } from '~/lib/projects';
import type { ErrorResponse, SessionUser } from '~/types';
import { authOptions } from '~/pages/api/auth/[...nextauth]';

export type ResponseSchema = Prisma.ProjectGetPayload<{
  select: {
    id: true;
    name: true;
  };
}>[];

/**
 * Get all projects the user has access to.
 * If the user is a manager, all projects are returned.
 * Otherwise, only projects the user has access to are returned.
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

  const session = await getServerSession(req, res, authOptions);

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
