import type { NextApiRequest, NextApiResponse } from 'next';
import { unstable_getServerSession } from 'next-auth/next';

import type { UnauthorisedResponse } from '~/types';
import { authOptions } from '~/pages/api/auth/[...nextauth]';
import { getAssignedProjects } from '~/server/store/projects';

export type ResponseSchema = Awaited<ReturnType<typeof getAssignedProjects>>;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseSchema | UnauthorisedResponse | { error: string }>,
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const session = await unstable_getServerSession(req, res, authOptions);

  if (!session || !session.user) {
    return res.status(401).json({ message: 'You must be logged in.' });
  }

  const email = session.user.email!;

  const projects = await getAssignedProjects(email);

  res.status(200).json(projects);
}
