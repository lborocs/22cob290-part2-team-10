import type { NextApiRequest, NextApiResponse } from 'next';
import { unstable_getServerSession } from 'next-auth/next';

import { getInviteToken } from '~/lib/inviteToken';
import type { ErrorResponse } from '~/types';
import { authOptions } from '~/pages/api/auth/[...nextauth]';

export type ResponseSchema = { inviteUrl: string };

/**
 * Get an invite URL, generated by signed in user.
 * The invite URL is valid for 1 week.
 * See {@link getInviteToken}.
 *
 * @param res Response object with a JSON body containing the invite URL. See {@link ResponseSchema}.
 * @example
 * ```ts
 * const { data } = await axios.get('/api/user/get-invite-url');
 * console.log(data); // { inviteUrl: 'https://example.com/signup?invite=...' }
 * ```
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseSchema | ErrorResponse>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const session = await unstable_getServerSession(req, res, authOptions);

  if (!session || !session.user) {
    return res.status(401).json({ error: 'You must be signed in.' });
  }

  const email = session.user.email!;

  const token = getInviteToken(email);

  const url = process.env.NEXTAUTH_URL as string;

  res.status(200).json({
    inviteUrl: `${url}/signup?invite=${token}`,
  });
}
