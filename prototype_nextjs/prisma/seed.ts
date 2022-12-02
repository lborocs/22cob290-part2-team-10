import { PrismaClient, type Prisma } from '@prisma/client';

// import { hashPassword } from '~/server/store/users';

async function hashPassword(raw: string) {
  return raw;
}

const prisma = new PrismaClient();

const testPassword = hashPassword('TestPassword123!');

const getUserData = async (): Promise<Prisma.UserCreateInput[]> => [
];

async function main() {
  console.log('Start seeding ...');

  for (const u of await getUserData()) {
    const user = await prisma.user.create({
      data: u,
    });
    console.log(`Created user with id: ${user.id}`);
  }

  console.log('Seeding finished.');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
