import type { NextApiRequest, NextApiResponse } from 'next';
import { unstable_getServerSession } from 'next-auth/next';
import type { z } from 'zod';

import ChangePasswordSchema from '~/schemas/api/user/changePassword';
import type { UnauthorisedResponse } from '~/types';
import { authOptions, type SessionUser } from '~/pages/api/auth/[...nextauth]';
import { changePassword, isCorrectPassword } from '~/server/store/users';

export type RequestSchema = z.infer<typeof ChangePasswordSchema>;

export type ResponseSchema = {
  success: boolean
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<UnauthorisedResponse | ResponseSchema>,
) {
  const session = await unstable_getServerSession(req, res, authOptions);

  if (!session || !session.user) {
    res.status(401).json({ message: 'You must be logged in.' });
    return;
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

  changePassword(userId, newPassword);

  res.status(200).json({ success: true });
}
