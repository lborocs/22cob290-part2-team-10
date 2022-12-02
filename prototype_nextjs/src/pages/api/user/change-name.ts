import type { NextApiRequest, NextApiResponse } from 'next';
import { unstable_getServerSession } from 'next-auth/next';
import type { z } from 'zod';

import ChangeNameSchema from '~/schemas/user/changeName';
import type { UnauthorisedResponse } from '~/types';
import { authOptions, type SessionUser } from '~/pages/api/auth/[...nextauth]';
import { changeName } from '~/server/store/users';

export type RequestSchema = z.infer<typeof ChangeNameSchema>;

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

  const safeParseResult = ChangeNameSchema.safeParse(req.body);

  if (!safeParseResult.success) {
    res.status(400).json({
      success: false,
      issues: safeParseResult.error.issues,
    } as ResponseSchema);
    return;
  }

  const { firstName, lastName } = safeParseResult.data;

  const userId = (session.user as SessionUser).id;

  await changeName(userId, firstName, lastName);

  res.status(200).json({ success: true });
}
