import type { NextApiRequest, NextApiResponse } from 'next';
import { unstable_getServerSession } from 'next-auth/next';
import type { z } from 'zod';

import prisma from '~/lib/prisma';
import TextAvatarSchema from '~/schemas/user/textAvatar';
import type { ErrorResponse, SessionUser } from '~/types';
import { authOptions } from '~/pages/api/auth/[...nextauth]';

export type RequestSchema = z.infer<typeof TextAvatarSchema>;

export type ResponseSchema = {
  success: boolean;
};

/**
 * Change the text avatar of the signed in user.
 * The text avatar is a combination of a background color and a foreground color.
 * See {@link TextAvatarSchema}.
 *
 * @param req Request object with a JSON body containing the background color and the foreground color. See {@link RequestSchema}.
 * @param res Response object with a JSON body containing the success status. See {@link ResponseSchema}.
 * @example
 * ```ts
 * const { data } = await axios.post('/api/user/change-text-avatar', {
 *   'avatar-bg': '#000000',
 *   'avatar-fg': '#ffffff',
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

  const safeParseResult = TextAvatarSchema.safeParse(req.body);

  if (!safeParseResult.success) {
    res.status(400).json({
      success: false,
      issues: safeParseResult.error.issues,
    } as ResponseSchema);
    return;
  }

  const { 'avatar-bg': avatarBg, 'avatar-fg': avatarFg } = safeParseResult.data;

  const userId = (session.user as SessionUser).id;

  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      avatarBg,
      avatarFg,
    },
  });

  res.status(200).json({ success: true });
}
