import { PrismaClient, type Prisma } from '@prisma/client';

// import { hashPassword } from '~/server/store/users';

async function hashPassword(raw: string) {
  return raw;
}

const prisma = new PrismaClient();

const testPassword = hashPassword('TestPassword123!');

const getUserData = async (): Promise<Prisma.UserCreateInput[]> => [
  {
    email: 'admin@make-it-all.co.uk',
    hashedPassword: await testPassword,
    name: 'Admin',
    avatar: { create: {} },
  },
  {
    email: 'alice@make-it-all.co.uk',
    hashedPassword: await testPassword,
    name: 'Alice Jones',
    avatar: { create: {} },
    inviter: {
      connect: {
        email: 'admin@make-it-all.co.uk',
      },
    },
  },
  {
    email: 'jane@make-it-all.co.uk',
    hashedPassword: await testPassword,
    name: 'Jane Doe',
    avatar: { create: {} },
    inviter: {
      connect: {
        email: 'admin@make-it-all.co.uk',
      },
    },
  },
];

async function main() {
  console.log('Start seeding ...');

  for (const u of await getUserData()) {
    const user = await prisma.user.create({
      data: u,
      include: {
        inviter: {
          select: {
            email: true,
          },
        },
      },
    });
    console.log(`Created user with id: ${user.id}, invited by email ${user.inviter?.email ?? 'null'}`);
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
