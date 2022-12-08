import { PrismaClient, type Prisma } from '@prisma/client';
import * as dotenv from 'dotenv';
import _ from 'lodash';
import { LoremIpsum } from 'lorem-ipsum';

import { hashPassword } from '../src/lib/user';
import { getInviteToken, getEmailFromToken } from '../src/lib/inviteToken';

// needed for `/lib/inviteToken` to know the secret for invite tokens
dotenv.config({
  path: '.env.development',
});

const prisma = new PrismaClient();

const lorem = new LoremIpsum({
  sentencesPerParagraph: {
    max: 8,
    min: 4,
  },
  wordsPerSentence: {
    max: 16,
    min: 3,
  },
});

/**
 * Generate a random date between today and the start of 2022.
 *
 * Example:
 * ```ts
 * const randomDate = new Date(randomTimeMs());
 * ```
 *
 * [Source](https://stackoverflow.com/a/9035732)
 */
function randomTimeMs(): number {
  const start = new Date(2022, 1, 1).getTime();
  const end = Date.now();

  const diff = end - start;

  return start + (Math.random() * diff);
}

const testPassword = hashPassword.bind(null, 'TestPassword123!');

const adminInviteToken = getInviteToken.bind(null, 'admin@make-it-all.co.uk');

const managerInviteToken = getInviteToken.bind(null, 'manager@make-it-all.co.uk');

const getUserData = async (): Promise<Prisma.UserCreateInput[]> => [
  {
    email: 'admin@make-it-all.co.uk',
    hashedPassword: await testPassword(),
    name: 'Admin',
  },
  {
    email: 'manager@make-it-all.co.uk',
    hashedPassword: await testPassword(),
    name: 'Project Manager',
    inviteToken: adminInviteToken(),
  },
  {
    email: 'leader@make-it-all.co.uk',
    hashedPassword: await testPassword(),
    name: 'Project Leader',
    inviteToken: managerInviteToken(),
  },
  {
    email: 'left@make-it-all.co.uk',
    hashedPassword: await testPassword(),
    name: 'Left The Company',
    inviteToken: adminInviteToken(),
    leftCompany: true, // should not be allowed to sign in
  },
  {
    email: 'alice@make-it-all.co.uk',
    hashedPassword: await testPassword(),
    name: 'Alice Felicity Henry', // text avatar should be AFH
    inviteToken: managerInviteToken(),
  },
  {
    email: 'jane@make-it-all.co.uk',
    hashedPassword: await testPassword(),
    name: 'Jane Doe Doherty Tate', // text avatar should be JDD
    inviteToken: managerInviteToken(),
  },
  {
    email: 'john@make-it-all.co.uk',
    hashedPassword: await testPassword(),
    name: 'John Smith',
    inviteToken: managerInviteToken(),
  },
];

const projectData: Prisma.ProjectCreateInput[] = _.range(1, 11).map<Prisma.ProjectCreateInput>((num) => ({
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
    connect: [
      {
        email: 'alice@make-it-all.co.uk',
      },
      {
        email: 'jane@make-it-all.co.uk',
      },
    ],
  },
  tasks: {
    create: [],
  },
}) satisfies Prisma.ProjectCreateInput).concat([
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
      connect: [
        {
          email: 'jane@make-it-all.co.uk',
        },
      ],
    },
  },
  {
    name: 'VERYYYYYYYYYYYYYYYYYYYYYYYYYYYYY LONGGGGGGGGGGGGGGGGGGGGGGGGGGGG NAME',
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
      connect: [
        {
          email: 'alice@make-it-all.co.uk',
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
      connect: [
        {
          email: 'alice@make-it-all.co.uk',
        },
        {
          email: 'john@make-it-all.co.uk',
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

const postData: Prisma.PostCreateInput[] = [
  {
    author: {
      connect: {
        email: 'alice@make-it-all.co.uk',
      },
    },
    title: 'Alice made this post!',
    summary: 'posted sometime between 1/1/22 and today',
    datePosted: new Date(randomTimeMs()),
    content: 'Well, sometimes you just gotta do what you gotta do',
    upvotes: 2000,
    topics: {
      connectOrCreate: [
        {
          where: {
            name: 'Topic1',
          },
          create: {
            name: 'Topic1',
          },
        },
        {
          where: {
            name: 'Topic2',
          },
          create: {
            name: 'Topic2',
          },
        },
      ],
    },
  },
  {
    author: {
      connect: {
        email: 'john@make-it-all.co.uk',
      },
    },
    title: 'A post by John',
    summary: 'john\'s post, posted today*',
    content: 'Oh hello there!\n* the day db was seeded',
    topics: {
      connectOrCreate: [
        {
          where: {
            name: 'Topic1',
          },
          create: {
            name: 'Topic1',
          },
        },
        {
          where: {
            name: 'Topic3',
          },
          create: {
            name: 'Topic3',
          },
        },
      ],
    },
  },
];

// TODO: makeRandomProject (will have to get the current users and pick random users to assign to it)

async function makeRandomUser(): Promise<Prisma.UserCreateInput> {
  const firstName = _.capitalize(lorem.generateWords(1));
  const lastName = _.capitalize(lorem.generateWords(1));
  const name = `${firstName} ${lastName}`;

  const email = `${firstName}@make-it-all.co.uk`.toLowerCase();

  const numberOfPosts = _.random(1, 11);

  return {
    email,
    hashedPassword: await testPassword(),
    name,
    inviteToken: managerInviteToken(),
    posts: {
      create: _.range(numberOfPosts).map(makeRandomPost),
    },
  };
}

function makeRandomPost(): Prisma.PostUncheckedCreateWithoutAuthorInput {
  const title = lorem.generateSentences(1);
  const summary = lorem.generateSentences(1);
  const content = lorem.generateParagraphs(_.random(1, 5));

  const topics = lorem.generateWords(_.random(1, 10)).split(' ');

  const upvotes = _.random(0, 400);

  return {
    title,
    summary,
    content,
    upvotes,
    topics: {
      connectOrCreate: topics.map(
        (name) => ({
          where: {
            name,
          },
          create: {
            name,
          },
        })
      ),
    },
  };
}

async function main() {
  console.log('Start seeding ...');

  await prisma.$transaction(async () => {
    // users

    for (const u of await getUserData()) {
      const user = await prisma.user.create({
        data: u,
      });

      console.log(`Created user with id: ${user.id} (name: ${user.name}), invited by email: ${getEmailFromToken(user.inviteToken)}`);
    }

    // random users + random posts
    for (const i of _.range(5)) {
      const data = await makeRandomUser();
      const user = await prisma.user.create({
        data,
        include: {
          _count: {
            select: {
              posts: true,
            },
          },
        },
      });

      console.log(`Created random user with id: ${user.id} (name: ${user.name}), with ${user._count.posts} posts`);
    }

    console.log();
    // projects

    for (const p of projectData) {
      const project = await prisma.project.create({
        data: p,
      });

      console.log(`Created project with id: ${project.id} (name: ${project.name})`);
    }

    console.log();

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
              email: true,
            },
          },
        },
      });
      const permittedEmails = projectTask.permitted.map((user) => user.email);

      console.log(
        `Created task with id: ${projectTask.id}, under project named: ${projectTask.project.name}, `
        + `assigned to user: ${projectTask.assignee.email}. Permitted emails: ${JSON.stringify(permittedEmails)}`
      );
    }

    console.log();
    // forum

    for (const p of postData) {
      const post = await prisma.post.create({
        data: p,
        include: {
          author: {
            select: {
              name: true,
            },
          },
        },
      });

      console.log(`Created post with id: ${post.id} (title: ${post.title}), authored by name: ${post.author.name}`);
    }
  }, {
    timeout: 15_000, // 15 seconds timeout
  });

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
