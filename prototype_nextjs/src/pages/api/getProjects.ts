import type { NextApiRequest, NextApiResponse } from 'next';
import { unstable_getServerSession } from 'next-auth/next';

import { authOptions } from '~/pages/api/auth/[...nextauth]';

type FailedResponse = any;

export type ResponseSchema = FailedResponse | {
  projectNames: string[]
};

// TODO: get from store
// TODO: better name (getProjectNames or smthn)
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseSchema>,
) {
  const session = await unstable_getServerSession(req, res, authOptions);

  if (!session) {
    res.status(401).json({
      error: 'Not authenticated',
    });
    return;
  }

  res.status(200).json({
    projectNames: [
      'Project 1',
      'Project 2',
      'Project 3',
      'Project 4',
      'Project 5',
    ],
  });
}
