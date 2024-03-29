import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import type { z } from 'zod';

import prisma from '~/lib/prisma';
import ChangeNameSchema from '~/schemas/user/changeName';
import type { ErrorResponse, SessionUser } from '~/types';
import { authOptions } from '~/pages/api/auth/[...nextauth]';

export type RequestSchema = z.infer<typeof ChangeNameSchema>;

export type ResponseSchema = {
  success: boolean;
};

/**
 * Change the name of the signed in user.
 *
 * @param req Request object with a JSON body containing the new name. See {@link RequestSchema}.
 * @param res Response object with a JSON body containing the success status. See {@link ResponseSchema}.
 * @example
 * ```ts
 * const { data } = await axios.post('/api/projects/change-name', {
 *   name: 'John Doe',
 * });
 * console.log(data); // { success: true }
 * ```
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseSchema | ErrorResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const session = await getServerSession(req, res, authOptions);

  if (!session || !session.user) {
    return res.status(401).json({ error: 'You must be signed in.' });
  }

  const safeParseResult = ChangeNameSchema.safeParse(req.body);

  if (!safeParseResult.success) {
    res.status(400).json({
      success: false,
      issues: safeParseResult.error.issues,
    } as ResponseSchema);
    return;
  }

  const { name } = safeParseResult.data;

  const userId = (session.user as SessionUser).id;

  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      name,
    },
  });

  res.status(200).json({ success: true });
}
