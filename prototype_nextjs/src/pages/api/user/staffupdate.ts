import prisma from '~/lib/prisma';

export async function updatevalue() {
  const updateUser = await prisma.user.update({
    where: {
      email: '',
    },
    data: {
      leftCompany: true,
    },
  });

  return updateUser;
}
