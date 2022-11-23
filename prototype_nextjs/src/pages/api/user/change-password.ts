import type { NextApiRequest, NextApiResponse } from 'next';
import { unstable_getServerSession } from 'next-auth/next';
import { object, type InferType } from 'yup';

import type { UnauthorisedResponse } from '~/types';
import { PASSWORD_SCHEMA } from '~/utils';
import { authOptions } from '~/pages/api/auth/[...nextauth]';
import { changePassword, isCorrectPassword } from '~/server/store/users';

const requestSchema = object({
  currentPassword: PASSWORD_SCHEMA.required(),
  newPassword: PASSWORD_SCHEMA.required(),
});

export type RequestSchema = InferType<typeof requestSchema>;

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

  try {
    requestSchema.validateSync(req.body, { strict: true });
  } catch (err) {
    res.status(200).json({
      success: false,
      err,
    } as ResponseSchema);
    return;
  }

  const { currentPassword, newPassword } = req.body as RequestSchema;

  const email = session.user.email!;

  if (!await isCorrectPassword(email, currentPassword)) {
    res.status(200).json({ success: false });
  }

  changePassword(email, newPassword);

  res.status(200).json({ success: true });
}
