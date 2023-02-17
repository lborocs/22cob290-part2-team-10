import type { NextApiRequest, NextApiResponse } from 'next';
import type { z } from 'zod';

import prisma from '~/lib/prisma';
import type TextAvatarSchema from '~/schemas/user/textAvatar';
import type { ErrorResponse } from '~/types';

export type ResponseSchema = z.infer<typeof TextAvatarSchema> | null;

/**
 * Get the text avatar of the user with the provided ID (from the query param).
 * The text avatar is a combination of a background color and a foreground color.
 * See {@link TextAvatarSchema}.
 *
 * @param res Response object with a JSON body containing the background color and the foreground color. See {@link ResponseSchema}.
 * @example
 * ```ts
 * const { data } = await axios.get('/api/user/get-text-avatar?userId=example');
 * console.log(data); // { 'avatar-bg': '#000000', 'avatar-fg': '#ffffff' }
 * ```
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseSchema | ErrorResponse>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const id = req.query.userId as string;

  const result = await prisma.user.findUnique({
    where: {
      id,
    },
    select: {
      avatarBg: true,
      avatarFg: true,
    },
  });

  res.status(200).json(
    result && {
      'avatar-bg': result.avatarBg,
      'avatar-fg': result.avatarFg,
    }
  );
}
