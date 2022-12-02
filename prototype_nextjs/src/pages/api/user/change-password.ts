import type { NextApiRequest, NextApiResponse } from 'next';
import { unstable_getServerSession } from 'next-auth/next';
import type { z } from 'zod';

import ChangePasswordSchema from '~/schemas/user/changePassword';
import type { UnauthorisedResponse } from '~/types';
import { authOptions, type SessionUser } from '~/pages/api/auth/[...nextauth]';
import { changePassword, isCorrectPassword } from '~/server/store/users';

export type RequestSchema = z.infer<typeof ChangePasswordSchema>;

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

  const safeParseResult = ChangePasswordSchema.safeParse(req.body);

  if (!safeParseResult.success) {
    res.status(400).json({
      success: false,
      issues: safeParseResult.error.issues,
    } as ResponseSchema);
    return;
  }

  const { currentPassword, newPassword } = safeParseResult.data;

  const userId = (session.user as SessionUser).id;

  if (!await isCorrectPassword(userId, currentPassword)) {
    res.status(200).json({ success: false });
    return;
  }

  await changePassword(userId, newPassword);

  res.status(200).json({ success: true });
}
