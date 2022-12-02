import type { Session } from 'next-auth';

import type { UserInfo } from '~/types';
import type { SessionUser } from '~/pages/api/auth/[...nextauth]';
import { getUserInfo } from '~/server/store/users';

/**
 * Helper function to get details about the signed in user
 *
 * @param session session returned from `unstable_getServerSession`
 * @returns the signed-in user
 */
export async function ssrGetUserInfo(session: Session): Promise<UserInfo> {
  const sUser = session.user as SessionUser;

  return (await getUserInfo(sUser.id))!;
}
