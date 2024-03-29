import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import type { z } from 'zod';

import prisma from '~/lib/prisma';
import { isCorrectPassword, hashPassword } from '~/lib/user';
import ChangePasswordSchema from '~/schemas/user/changePassword';
import type { ErrorResponse, SessionUser } from '~/types';
import { authOptions } from '~/pages/api/auth/[...nextauth]';

export type RequestSchema = z.infer<typeof ChangePasswordSchema>;

export type ResponseSchema = {
  success: boolean;
};

/**
 * Change the password of the signed in user. The current password must be provided.
 * The new password _can_ be the same as the current password, but this should not be the case
 * as the client should not allow the user to submit the same password as the current password.
 *
 * @param req Request object with a JSON body containing the current password and the new password. See {@link RequestSchema}.
 * @param res Response object with a JSON body containing the success status. See {@link ResponseSchema}.
 * @example
 * ```ts
 * const { data } = await axios.post('/api/user/change-password', {
 *   currentPassword: 'correctPassword',
 *   newPassword: 'newPassword123!',
 * });
 * console.log(data); // { success: true }
 * ```
 * @example
 * ```ts
 * const { data } = await axios.post('/api/user/change-password', {
 *  currentPassword: 'wrongPassword',
 *  newPassword: 'newPassword123!',
 * });
 * console.log(data); // { success: false }
 * ```
 * @example
 * ```ts
 * const { data } = await axios.post('/api/user/change-password', {
 *  currentPassword: 'password',
 *  newPassword: 'invalidPassword',
 * });
 * console.log(data); // { success: false }
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

  const safeParseResult = ChangePasswordSchema.safeParse(req.body);

  if (!safeParseResult.success) {
    return res.status(400).json({
      success: false,
      issues: safeParseResult.error.issues,
    } as ResponseSchema);
  }

  const { currentPassword, newPassword } = safeParseResult.data;

  const userId = (session.user as SessionUser).id;

  const { id, hashedPassword } = await prisma.user.findUniqueOrThrow({
    where: {
      id: userId,
    },
    select: {
      id: true,
      hashedPassword: true,
    },
  });

  if (!(await isCorrectPassword(currentPassword, hashedPassword))) {
    return res.status(200).json({
      success: false,
    });
  }

  await prisma.user.update({
    where: {
      id,
    },
    data: {
      hashedPassword: await hashPassword(newPassword),
    },
  });

  res.status(200).json({ success: true });
}
