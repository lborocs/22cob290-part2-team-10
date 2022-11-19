import type { NextApiRequest, NextApiResponse } from 'next';
import { object, string, type InferType } from 'yup';

import type { User } from '~/types';
import { users } from '~/server/store/users';
import { PASSWORD_SCHEMA } from '~/utils';

export enum ErrorReason {
  WRONG_PASSWORD = 'WRONG_PASSWORD',
  DOESNT_EXIST = 'DOESNT_EXIST',
  BAD_CREDENTIALS = 'BAD_CREDENTIALS',
}

const requestSchema = object({
  email: string().email().required(),
  password: PASSWORD_SCHEMA.required(),
});

type RequestSchema = InferType<typeof requestSchema>;

export type ResponseSchema = User;

// TODO: not return password
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseSchema>,
) {
  try {
    requestSchema.validateSync(req.body, { strict: true });
  } catch (err) {
    res.status(400);
    return;
  }

  const { email, password } = req.body as RequestSchema;

  const user = users.find((user) => user.email === email);

  if (!user) {
    res.status(400);
    return;
  }

  if (password !== user.password) {
    res.status(401);
    return;
  }

  // TODO: set credential cookie, or use next-auth

  res.status(200).json(user);
}
