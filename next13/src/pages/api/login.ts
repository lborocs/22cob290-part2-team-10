import type { NextApiRequest, NextApiResponse } from 'next';

import type { User } from '~/types';
import { users } from '~/server/store/users';
import { isValidMakeItAllEmail, validatePassword } from '~/utils';

type RequestSchema = {
  email: string
  password: string
}

type FailedRequest = {
  success: false
  reason: ErrorReason
}

export enum ErrorReason {
  WRONG_PASSWORD = 'WRONG_PASSWORD',
  DOESNT_EXIST = 'DOESNT_EXIST',
  BAD_CREDENTIALS = 'BAD_CREDENTIALS',
}

export type ResponseSchema = FailedRequest | {
  success: true
  user: User
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseSchema>,
) {
  const { email, password } = req.body as RequestSchema;

  if (!isValidMakeItAllEmail(email) || (validatePassword(password) !== null)) {
    res.status(200).json({
      success: false,
      reason: ErrorReason.BAD_CREDENTIALS,
    });
    return;
  }

  const user = users.find((user) => user.email === email);

  if (!user) {
    res.status(200).json({
      success: false,
      reason: ErrorReason.DOESNT_EXIST,
    });
    return;
  }

  if (password !== user.password) {
    res.status(200).json({
      success: false,
      reason: ErrorReason.WRONG_PASSWORD,
    });
    return;
  }

  // TODO: set credential cookie, or use next-auth

  res.status(200).json({
    success: true,
    user,
  });
}
