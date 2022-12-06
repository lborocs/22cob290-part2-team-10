import type { NextApiRequest, NextApiResponse } from 'next';
import type { z } from 'zod';
import { getEmailFromTokenIfValid } from '~/lib/inviteToken';

import prisma from '~/lib/prisma';
import { hashPassword } from '~/lib/user';
import SignUpSchema from '~/schemas/user/signup';

// TODO*: how specific feedback do we want to give?
export type ErrorReason =
  | 'ALREADY_EXISTS'
  | 'INVALID_TOKEN'
  | 'USED_TOKEN'
  ;

export type RequestSchema = z.infer<typeof SignUpSchema>;

type FailedResponse = {
  success: false
  reason: ErrorReason
};

export type ResponseSchema = FailedResponse | {
  success: true
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseSchema | { error: string }>,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const safeParseResult = SignUpSchema.safeParse(req.body);

  if (!safeParseResult.success) {
    res.status(400).json({
      success: false,
      reason: '',
      issues: safeParseResult.error.issues,
    } as unknown as ResponseSchema);
    return;
  }

  const { inviteToken, email, name, password } = safeParseResult.data;

  const exists = await prisma.user.count({
    where: {
      email,
    },
  }) > 0;

  if (exists) return res.status(200).json({
    success: false,
    reason: 'ALREADY_EXISTS',
  });

  const inviterEmail = getEmailFromTokenIfValid(inviteToken);

  if (!inviterEmail) return res.status(200).json({
    success: false,
    reason: 'INVALID_TOKEN',
  });

  const inviter = await prisma.user.findUnique({
    where: {
      email: inviterEmail,
    },
    select: {
      leftCompany: true,
    },
  });

  if (inviter === null || inviter.leftCompany) return res.status(200).json({
    success: false,
    reason: 'INVALID_TOKEN',
  });

  const tokenAlreadyUsed = await prisma.user.count({
    where: {
      inviteToken,
    },
  }) > 0;

  if (tokenAlreadyUsed) return res.status(200).json({
    success: false,
    reason: 'USED_TOKEN',
  });

  await prisma.user.create({
    data: {
      email,
      name,
      hashedPassword: await hashPassword(password),
      inviteToken,
    },
  });

  res.status(200).json({
    success: true,
  });
}
