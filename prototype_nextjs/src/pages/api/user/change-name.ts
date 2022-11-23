import type { NextApiRequest, NextApiResponse } from 'next';
import { unstable_getServerSession } from 'next-auth/next';
import { object, string, type InferType } from 'yup';

import type { UnauthorisedResponse } from '~/types';
import { authOptions } from '~/pages/api/auth/[...nextauth]';
import { changeName } from '~/server/store/users';

const requestSchema = object({
  firstName: string().required(), // TODO: not empty?
  lastName: string().required(),
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

  const { firstName, lastName } = req.body as RequestSchema;

  const email = session.user.email!;

  changeName(email, firstName, lastName);

  res.status(200).json({ success: true });
}
