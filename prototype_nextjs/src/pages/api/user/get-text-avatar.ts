import type { NextApiRequest, NextApiResponse } from 'next';
import { unstable_getServerSession } from 'next-auth/next';
import type { z } from 'zod';

import prisma from '~/lib/prisma';
import type TextAvatarSchema from '~/schemas/user/textAvatar';
import type { ErrorResponse, SessionUser } from '~/types';
import { authOptions } from '~/pages/api/auth/[...nextauth]';

export type ResponseSchema = z.infer<typeof TextAvatarSchema>;

// TODO: cache (https://stackoverflow.blog/2022/12/20/best-practices-to-increase-the-speed-for-next-js-apps/)
// or maybe not? cos its quite funky when they change their text avatar colours
// ^ need to revisit code that changed text avatar colours
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseSchema | ErrorResponse>,
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const session = await unstable_getServerSession(req, res, authOptions);

  if (!session || !session.user) {
    return res.status(401).json({ error: 'You must be signed in.' });
  }

  const userId = (session.user as SessionUser).id;

  const result = await prisma.user.findUniqueOrThrow({
    where: {
      id: userId,
    },
    select: {
      avatarBg: true,
      avatarFg: true,
    },
  });

  res.status(200).json({
    'avatar-bg': result.avatarBg,
    'avatar-fg': result.avatarFg,
  });
}
