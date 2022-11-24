import type { Session } from 'next-auth';

import type { UserInfo } from '~/types';
import type { SessionUser } from '~/pages/api/auth/[...nextauth]';
import { getUserInfo } from '~/server/store/users';

export async function ssrGetUserInfo(session: Session): Promise<UserInfo> {
  const sUser = session.user as SessionUser;

  return (await getUserInfo(sUser.id))!;
}
