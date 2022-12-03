import type { Session } from 'next-auth';

import prisma from '~/lib/prisma';
import { type ExposedUser, computeExposedUser } from '~/types';
import type { SessionUser } from '~/server/types';

/**
 * Helper function to get details about the signed in user
 *
 * @param session session returned from `unstable_getServerSession`
 * @returns the signed-in user
 */
export async function ssrGetUserInfo(session: Session): Promise<ExposedUser> {
  const sUser = session.user as SessionUser;

  const user = await prisma.user.findUniqueOrThrow({
    where: {
      id: sUser.id,
    },
  });

  return computeExposedUser(user);
}
