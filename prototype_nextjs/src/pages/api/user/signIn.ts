import type { NextApiRequest, NextApiResponse } from 'next';
import type { z } from 'zod';

import prisma from '~/lib/prisma';
import { isCorrectPassword } from '~/lib/user';
import SignInSchema from '~/schemas/user/signIn';
import type { SessionUser } from '~/server/types';

export enum ErrorReason {
  WRONG_PASSWORD = 'WRONG_PASSWORD',
  DOESNT_EXIST = 'DOESNT_EXIST',
  BAD_CREDENTIALS = 'BAD_CREDENTIALS',
}

export type RequestSchema = z.infer<typeof SignInSchema>;

type FailedResponse = {
  success: false
  reason: ErrorReason
};

export type ResponseSchema = FailedResponse | {
  success: true
  user: SessionUser
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseSchema | { error: string }>,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const safeParseResult = SignInSchema.safeParse(req.body);

  if (!safeParseResult.success) {
    res.status(400).json({
      success: false,
      reason: ErrorReason.BAD_CREDENTIALS,
      issues: safeParseResult.error.issues,
    } as ResponseSchema);
    return;
  }

  const { email, password } = safeParseResult.data;

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
      email: true,
      name: true,
      hashedPassword: true,
    },
  });

  if (!user) return res.status(200).json({
    success: false,
    reason: ErrorReason.DOESNT_EXIST,
  });

  if (!await isCorrectPassword(password, user.hashedPassword)) return res.status(200).json({
    success: false,
    reason: ErrorReason.WRONG_PASSWORD,
  });

  return res.status(200).json({
    success: true,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      image: null,
    },
  });
}
