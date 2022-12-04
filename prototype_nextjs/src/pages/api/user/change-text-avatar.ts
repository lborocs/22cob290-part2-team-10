import type { NextApiRequest, NextApiResponse } from 'next';
import { unstable_getServerSession } from 'next-auth/next';
import type { z } from 'zod';

import prisma from '~/lib/prisma';
import TextAvatarSchema from '~/schemas/user/textAvatar';
import type { UnauthorisedResponse, SessionUser } from '~/types';
import { authOptions } from '~/pages/api/auth/[...nextauth]';

export type RequestSchema = z.infer<typeof TextAvatarSchema>;

export type ResponseSchema = {
  success: boolean
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseSchema | UnauthorisedResponse | { error: string }>,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const session = await unstable_getServerSession(req, res, authOptions);

  if (!session || !session.user) {
    return res.status(401).json({ message: 'You must be signed in.' });
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
