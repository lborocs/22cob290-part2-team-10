import { PrismaClient, type Prisma } from '@prisma/client';

import { hashPassword } from '../src/lib/user';
import { range } from '../src/utils';

const prisma = new PrismaClient();

const testPassword = hashPassword('TestPassword123!');

const adminInvite: Prisma.UserCreateNestedOneWithoutInvitedInput = {
  connect: {
    email: 'admin@make-it-all.co.uk',
  },
};

const getUserData = async (): Promise<Prisma.UserCreateInput[]> => [
  {
    email: 'admin@make-it-all.co.uk',
    hashedPassword: await testPassword,
    name: 'Admin',
  },
  {
    email: 'manager@make-it-all.co.uk',
    hashedPassword: await testPassword,
    name: 'Project Manager',
    inviter: adminInvite,
  },
  {
    email: 'leader@make-it-all.co.uk',
    hashedPassword: await testPassword,
    name: 'Project Leader',
    inviter: adminInvite,
  },
  {
    email: 'left@make-it-all.co.uk',
    hashedPassword: await testPassword,
    name: 'Left The Company',
    inviter: adminInvite,
    leftCompany: true,
  },
  {
    email: 'alice@make-it-all.co.uk',
    hashedPassword: await testPassword,
    name: 'Alice Jones',
    inviter: adminInvite,
  },
  {
    email: 'jane@make-it-all.co.uk',
    hashedPassword: await testPassword,
    name: 'Jane Doe',
    inviter: adminInvite,
  },
  {
    email: 'john@make-it-all.co.uk',
    hashedPassword: await testPassword,
    name: 'John Smith',
    inviter: adminInvite,
  },
];

const projectData: Prisma.ProjectCreateInput[] = range(1, 10).map<Prisma.ProjectCreateInput>((num) => ({
  name: `Project ${num}`,
  manager: {
    connect: {
      email: 'manager@make-it-all.co.uk',
    },
  },
  leader: {
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
  tasks: {
    create: [],
  },
})).concat([
  {
    name: 'Alice SHOULD NOT see this',
    manager: {
      connect: {
        email: 'manager@make-it-all.co.uk',
      },
    },
    leader: {
      connect: {
        email: 'leader@make-it-all.co.uk',
      },
    },
    members: {
      create: [
        {
          member: {
            connect: {
              email: 'jane@make-it-all.co.uk',
            },
          },
        },
      ],
    },
  },
]);

const taskData: Prisma.ProjectTaskCreateInput[] = [
  {
    project: {
      connect: {
        id: 1,
      },
    },
    title: 'Alice\'s Task',
    description: 'desc',
    stage: 'TODO',
    tags: {
      create: {
        name: 'TestTag',
      },
    },
    assignee: {
      connect: {
        email: 'alice@make-it-all.co.uk',
      },
    },
  },
  {
    project: {
      connect: {
        id: 1,
      },
    },
    title: 'Manager\'s Task',
    description: 'Alice SHOULD see this',
    stage: 'COMPLETED',
    tags: {
      connectOrCreate: [
        {
          where: {
            name: 'TestTag',
          },
          create: {
            name: 'This should NOT appear because this should evaluating to connecting to TestTag',
          },
        },
      ],
    },
    assignee: {
      connect: {
        email: 'manager@make-it-all.co.uk',
      },
    },
    permitted: {
      create: [
        {
          user: {
            connect: {
              email: 'alice@make-it-all.co.uk',
            },
          },
        },
        {
          user: {
            connect: {
              email: 'john@make-it-all.co.uk',
            },
          },
        },
      ],
    },
  },
  {
    project: {
      connect: {
        id: 1,
      },
    },
    title: 'Jane\'s Task',
    description: 'Alice SHOULD NOT see this',
    stage: 'IN_PROGRESS',
    tags: {
      connectOrCreate: [
        {
          where: {
            name: 'This tag should appear',
          },
          create: {
            name: 'This tag should appear',
          },
        },
      ],
    },
    assignee: {
      connect: {
        email: 'jane@make-it-all.co.uk',
      },
    },
  },
  {
    project: {
      connect: {
        id: 2,
      },
    },
    title: 'Project 2 Task',
    description: 'Alice should only have 1 task in project 1',
    stage: 'IN_PROGRESS',
    tags: {
      connectOrCreate: [
        {
          where: {
            name: 'TestTag',
          },
          create: {
            name: 'TestTag',
          },
        },
      ],
    },
    assignee: {
      connect: {
        email: 'alice@make-it-all.co.uk',
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
    console.log(`Created user with id: ${user.id} (name: ${user.name}), invited by email: ${user.inviter?.email}`);
  }

  for (const p of projectData) {
    const project = await prisma.project.create({
      data: p,
    });
    console.log(`Created project with id: ${project.id} (name: ${project.name})`);
  }

  for (const t of taskData) {
    const projectTask = await prisma.projectTask.create({
      data: t,
      include: {
        project: {
          select: {
            name: true,
          },
        },
        assignee: {
          select: {
            email: true,
          },
        },
        permitted: {
          select: {
            user: {
              select: {
                email: true,
              },
            },
          },
        },
      },
    });
    const permittedEmails = projectTask.permitted.map(({ user }) => user.email);

    console.log(
      `Created task with id: ${projectTask.id}, under project named: ${projectTask.project.name}, `
      + `assigned to user: ${projectTask.assignee.email}. Permitted emails: ${JSON.stringify(permittedEmails)}`
    );
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
