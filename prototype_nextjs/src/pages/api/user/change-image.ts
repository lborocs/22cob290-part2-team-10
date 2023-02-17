import type { NextApiRequest, NextApiResponse } from 'next';
import { unstable_getServerSession } from 'next-auth/next';
import type { z } from 'zod';

import prisma from '~/lib/prisma';
import ChangeImageSchema from '~/schemas/user/changeImage';
import type { ErrorResponse, SessionUser } from '~/types';
import { authOptions } from '~/pages/api/auth/[...nextauth]';

export type RequestSchema = z.infer<typeof ChangeImageSchema>;

export type ResponseSchema = {
  success: boolean;
};

/**
 * Change the image of the signed in user.
 *
 * @param req Request object with a JSON body containing the new name. See {@link RequestSchema}.
 * @param res Response object with a JSON body containing the success status. See {@link ResponseSchema}.
 * @example
 * ```ts
 * const { data } = await axios.post('/api/projects/change-image', {
 *   image: 'https://example.com/image.png',
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

  const session = await unstable_getServerSession(req, res, authOptions);

  if (!session || !session.user) {
    return res.status(401).json({ error: 'You must be signed in.' });
  }

  const safeParseResult = ChangeImageSchema.safeParse(req.body);

  if (!safeParseResult.success) {
    res.status(400).json({
      success: false,
      issues: safeParseResult.error.issues,
    } as ResponseSchema);
    return;
  }

  const { image } = safeParseResult.data;

  const userId = (session.user as SessionUser).id;

  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      // Remove the image if the URL is empty
      image: image || null,
    },
  });

  res.status(200).json({ success: true });
}
