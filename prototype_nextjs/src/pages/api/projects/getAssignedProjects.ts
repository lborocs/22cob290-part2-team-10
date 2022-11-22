import type { NextApiRequest, NextApiResponse } from 'next';
import { unstable_getServerSession } from 'next-auth/next';

import { authOptions } from '~/pages/api/auth/[...nextauth]';
import { getAssignedProjects } from '~/server/store/projects';

type FailedResponse = {
  message: string
};

export type ResponseSchema = FailedResponse | string[];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseSchema>,
) {
  const session = await unstable_getServerSession(req, res, authOptions);

  if (!session || !session.user) {
    res.status(401).json({ message: 'You must be logged in.' });
    return;
  }

  const email = session.user.email!;

  const projects = await getAssignedProjects(email);

  res.status(200).json(projects);
}