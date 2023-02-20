import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';

import prisma from '~/lib/prisma';
import type { ErrorResponse, SessionUser } from '~/types';
import { authOptions } from '~/pages/api/auth/[...nextauth]';

export type ResponseSchema = {
  user: SessionUser;
};

/**
 * Get the signed in user from the session.
 * See {@link authOptions ~/pages/api/auth/[...nextauth].ts}.
 *
 * @param res Response object with a JSON body containing the user. See {@link ResponseSchema}.
 * @example
 * ```ts
 * const { data } = await axios.get('/api/user/get-user-from-session');
 * console.log(data.user); // { id: '...', email: '...', name: '...', ... }
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

  const userId = (session.user as SessionUser).id;

  const user = await prisma.user.findUniqueOrThrow({
    where: {
      id: userId,
    },
    select: {
      id: true,
      email: true,
      name: true,
      isManager: true,
      image: true,
    },
  });

  res.status(200).json({
    user,
  });
}
