import { PrismaClient, type Prisma } from '@prisma/client';

import { hashPassword } from '../src/lib/user';
import { range } from '../src/utils';

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
  {
    email: 'manager@make-it-all.co.uk',
    hashedPassword: await testPassword,
    name: 'Manager',
    avatar: { create: {} },
    inviter: {
      connect: {
        email: 'admin@make-it-all.co.uk',
      },
    },
  },
  {
    email: 'leader@make-it-all.co.uk',
    hashedPassword: await testPassword,
    name: 'Leader',
    avatar: { create: {} },
    inviter: {
      connect: {
        email: 'admin@make-it-all.co.uk',
      },
    },
  },
  {
    email: 'left@make-it-all.co.uk',
    hashedPassword: await testPassword,
    name: 'Left The Company',
    avatar: { create: {} },
    inviter: {
      connect: {
        email: 'admin@make-it-all.co.uk',
      },
    },
    leftCompany: true,
  },
];

const projectData = range(1, 10).map<Prisma.ProjectCreateInput>((num) => ({
  name: `Project ${num}`,
  leader: {
    connect: {
      email: 'manager@make-it-all.co.uk',
    },
  },
  manager: {
    connect: {
      email: 'leader@make-it-all.co.uk',
    },
  },
  members: {
    create: [
      {
        member: {
          connect: {
            email: 'alice@make-it-all.co.uk',
          },
        },
      },
      {
        member: {
          connect: {
            email: 'jane@make-it-all.co.uk',
          },
        },
      },
    ],
  },
}));


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
    console.log(`Created user with id: ${user.id} (name: ${user.name}), invited by email: ${user.inviter?.email}`);
  }

  for (const p of projectData) {
    const project = await prisma.project.create({
      data: p,
    });
    console.log(`Created project with id: ${project.id} (name: ${project.name})`);
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
