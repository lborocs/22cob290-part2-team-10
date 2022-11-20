import type { NextApiRequest, NextApiResponse } from 'next';
import { User } from 'next-auth';
import { object, string, type InferType } from 'yup';

// import type { User } from '~/types';
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

type FailedResponse = {
  success: false
  reason: ErrorReason
};

export type ResponseSchema = FailedResponse | {
  success: true
  user: User & {
    name: string
  }
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseSchema>,
) {
  try {
    requestSchema.validateSync(req.body, { strict: true });
  } catch (err) {
    res.status(200).json({
      success: false,
      reason: ErrorReason.BAD_CREDENTIALS,
      err,
    } as ResponseSchema);
    return;
  }

  const { email, password } = req.body as RequestSchema;

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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: omit, ...result } = user;

  res.status(200).json({
    success: true,
    user: {
      id: result.email, // maybe for account.providerAccountId
      name: `${user.fname} ${user.lname}`,
      image: 'WHAT IS IMAGE FOR',
      ...result,
    },
  } as any);
}
