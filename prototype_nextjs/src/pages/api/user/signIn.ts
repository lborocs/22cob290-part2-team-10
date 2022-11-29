import type { NextApiRequest, NextApiResponse } from 'next';
import type { User } from 'next-auth';
import type { z } from 'zod';

import SignInSchema from '~/schemas/user/signIn';
// import type { User } from '~/types';
import { getUserInfoByEmail, isCorrectPassword } from '~/server/store/users';

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
  user: User
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

  const userInfo = await getUserInfoByEmail(email);

  if (!userInfo) {
    res.status(200).json({
      success: false,
      reason: ErrorReason.DOESNT_EXIST,
    });
    return;
  }

  if (!await isCorrectPassword(userInfo.id, password)) {
    res.status(200).json({
      success: false,
      reason: ErrorReason.WRONG_PASSWORD,
    });
    return;
  }

  res.status(200).json({
    success: true,
    user: {
      ...userInfo,
      name: `${userInfo.firstName} ${userInfo.lastName}`, // we could just return null
      image: 'WHAT IS IMAGE FOR?????????????????????????????', // we could just return null
    },
  });
}
