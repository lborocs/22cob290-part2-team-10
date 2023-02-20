import { PrismaClient, type Prisma } from '@prisma/client';
import * as dotenv from 'dotenv';
import capitalize from 'lodash/capitalize';
import random from 'lodash/random';
import range from 'lodash/range';
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
function randomTimeMs(
  start: Date = new Date(2022, 1, 1),
  end: Date = new Date()
): number {
  const startTime = start.getTime();
  const endTime = end.getTime();

  const diff = endTime - startTime;

  return startTime + Math.random() * diff;
}

const testPassword = hashPassword.bind(null, 'TestPassword123!');

const adminInviteToken = getInviteToken.bind(null, 'admin@make-it-all.co.uk');

const managerInviteToken = getInviteToken.bind(
  null,
  'manager@make-it-all.co.uk'
);

const getUserData = async (): Promise<Prisma.UserCreateInput[]> => [
  {
    email: 'admin@make-it-all.co.uk',
    hashedPassword: await testPassword(),
    name: 'Admin',
    isAdmin: true,
    isManager: true,
  },
  {
    email: 'manager@make-it-all.co.uk',
    hashedPassword: await testPassword(),
    name: 'Project Manager',
    inviteToken: adminInviteToken(),
    isManager: true,
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
    image:
      'https://www.citypng.com/public/uploads/preview/messi-with-trophy-fifa-world-cup-qatar-2022-hd-png-11671390277niwcwxtise.png',
  },
  {
    email: 'jane@make-it-all.co.uk',
    hashedPassword: await testPassword(),
    name: 'Jane Doe Doherty Tate', // text avatar should be JDD
    inviteToken: managerInviteToken(),
    isManager: true,
  },
  {
    email: 'john@make-it-all.co.uk',
    hashedPassword: await testPassword(),
    name: 'John Smith',
    inviteToken: managerInviteToken(),
    avatarBg: '#0000ff',
  },
];

// TODO: seed user's todo list

const projectData: Prisma.ProjectCreateInput[] = range(1, 11)
  .map<Prisma.ProjectCreateInput>(
    (num) =>
      ({
        name: `Project ${num}`,
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
      } satisfies Prisma.ProjectCreateInput)
  )
  .concat([
    {
      name: 'ONLY Manager, John & Jane should see this',
      leader: {
        connect: {
          email: 'john@make-it-all.co.uk',
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
      leader: {
        connect: {
          email: 'john@make-it-all.co.uk',
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
    title: "Alice's Task",
    description: 'desc',
    stage: 'TODO',
    deadline: new Date(2023, 2, 10),
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
    title: "Manager's Task",
    description: 'Alice SHOULD see this',
    stage: 'COMPLETED',
    deadline: new Date(randomTimeMs(new Date(), new Date(2023, 11, 31))),
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
    title: "Jane's Task",
    description: 'Alice SHOULD NOT see this',
    stage: 'IN_PROGRESS',
    deadline: new Date(randomTimeMs(new Date(), new Date(2023, 11, 31))),
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
    deadline: new Date(randomTimeMs(new Date(), new Date(2023, 11, 31))),
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
    // datePosted: new Date(randomTimeMs()),
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
    upvoters: {
      connect: [
        {
          email: 'manager@make-it-all.co.uk',
        },
        {
          email: 'john@make-it-all.co.uk',
        },
      ],
    },
    history: {
      create: [
        {
          editor: {
            connect: {
              email: 'alice@make-it-all.co.uk',
            },
          },
          title: 'Alice made this post!',
          summary: 'posted sometime between 1/1/22 and today',
          content: 'Well, sometimes you just gotta do what you gotta do',
          date: new Date(randomTimeMs()),
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
    history: {
      create: [
        {
          editor: {
            connect: {
              email: 'john@make-it-all.co.uk',
            },
          },
          title: 'A post by John',
          summary: "john's post, posted today*",
          content: 'Oh hello there!\n* the day db was seeded',
        },
      ],
    },
  },
];

// TODO: makeRandomProject (will have to get the current users and pick random users to assign to it)

async function makeRandomUser(): Promise<Prisma.UserCreateInput> {
  const firstName = capitalize(lorem.generateWords(1));
  const lastName = capitalize(lorem.generateWords(1));
  const name = `${firstName} ${lastName}`;

  const email = `${firstName}@make-it-all.co.uk`.toLowerCase();

  const numberOfPosts = random(1, 11);
  const posts = await Promise.all(
    range(numberOfPosts).map(makeRandomPost.bind(undefined, email))
  );

  const isManager = random() > 0.3;

  return {
    email,
    hashedPassword: await testPassword(),
    name,
    inviteToken: managerInviteToken(),
    isManager,
    posts: {
      create: posts,
    },
  };
}

async function makeRandomPost(
  authorEmail: string
): Promise<Prisma.PostUncheckedCreateWithoutAuthorInput> {
  const title = lorem.generateSentences(1);
  const summary = lorem.generateSentences(1);
  const content = lorem.generateParagraphs(random(1, 5));

  const topics = lorem.generateWords(random(1, 10)).split(' ');

  async function getUpvoters(): Promise<string[]> {
    const users = await getUserData();
    const nUsers = users.length;

    const nUpvotes = random(0, nUsers - 1);
    const upVotedUsers = new Set<string>(); // emails

    range(0, nUpvotes).forEach(() => {
      let email: string;

      do {
        email = users[random(0, nUsers - 1)].email;
      } while (upVotedUsers.has(email));

      upVotedUsers.add(email);
    });

    return [...upVotedUsers];
  }
  const upvoters = await getUpvoters();

  const adminEdited = random() > 0.2;

  return {
    upvoters: {
      connect: upvoters.map((email) => ({
        email,
      })),
    },
    topics: {
      connectOrCreate: topics.map((name) => ({
        where: {
          name,
        },
        create: {
          name,
        },
      })),
    },
    history: {
      create: [
        {
          editor: {
            connect: {
              email: authorEmail,
            },
          },
          title,
          summary,
          content,
        },
      ].concat(
        adminEdited
          ? [
              {
                editor: {
                  connect: {
                    email: 'admin@make-it-all.co.uk',
                  },
                },
                title: `ADMIN edited: ${title}`,
                summary,
                content,
              },
            ]
          : []
      ),
    },
  };
}

async function main() {
  console.log('Start seeding ...');

  // https://www.prisma.io/docs/concepts/components/prisma-client/transactions#interactive-transactions
  await prisma.$transaction(
    async (tx) => {
      // users

      for (const u of await getUserData()) {
        const user = await tx.user.create({
          data: u,
        });

        console.log(
          `Created user with id: ${user.id} (name: ${
            user.name
          }), invited by email: ${getEmailFromToken(user.inviteToken)}`
        );
      }

      // random users + random posts
      for (const i of range(5)) {
        const data = await makeRandomUser();
        const user = await tx.user.create({
          data,
          include: {
            _count: {
              select: {
                posts: true,
              },
            },
          },
        });

        console.log(
          `Created random user with id: ${user.id} (name: ${user.name}), with ${user._count.posts} posts`
        );
      }

      console.log();
      // projects

      for (const p of projectData) {
        const project = await tx.project.create({
          data: p,
        });

        console.log(
          `Created project with id: ${project.id} (name: ${project.name})`
        );
      }

      console.log();

      for (const t of taskData) {
        const projectTask = await tx.projectTask.create({
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
          `Created task with id: ${projectTask.id}, under project named: ${projectTask.project.name}, ` +
            `assigned to user: ${
              projectTask.assignee.email
            }. Permitted emails: ${JSON.stringify(permittedEmails)}`
        );
      }

      console.log();
      // forum

      for (const p of postData) {
        const post = await tx.post.create({
          data: p,
          include: {
            author: {
              select: {
                name: true,
              },
            },
            history: {
              orderBy: {
                date: 'desc',
              },
              take: 1,
            },
          },
        });

        console.log(
          `Created post with id: ${post.id} (title: ${post.history[0].title}), authored by name: ${post.author.name}`
        );
      }
    },
    {
      timeout: 15_000, // 15 seconds timeout
    }
  );

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
