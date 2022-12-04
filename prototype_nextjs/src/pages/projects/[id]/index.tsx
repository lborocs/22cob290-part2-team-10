import type { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import Head from 'next/head';
import { unstable_getServerSession } from 'next-auth/next';
import type { Prisma } from '@prisma/client';

import hashids from '~/lib/hashids';
import prisma from '~/lib/prisma';
import { userHasAccessToProject, getUserRoleInProject, computeAssignedToMe, toProjectTasks } from '~/lib/projects';
import ErrorPage from '~/components/ErrorPage';
import { SidebarType, type PageLayout } from '~/components/Layout';
import KanbanBoard from '~/components/projects/KanbanBoard';
import { type SessionUser, type ProjectTaskInfo, ProjectRole } from '~/types';
import { authOptions } from '~/pages/api/auth/[...nextauth]';

// TODO: project page (Projects page from before)
export default function ProjectPage({ noAccess, project, role, tasks }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  if (noAccess) return (
    <ErrorPage
      title="You do not have access to this project."
      buttonContent="Projects"
      buttonUrl="/projects"
    />
  );

  if (!project) return (
    <ErrorPage
      title="Project does not exist."
      buttonContent="Projects"
      buttonUrl="/projects"
    />
  );

  const {
    name,
    manager,
    leader,
  } = project;

  const pageTitle = `${name} - Make-It-All`;

  return (
    <main>
      <Head>
        <title>{pageTitle}</title>
      </Head>
      <div>
        <h1>{name}</h1>
        <h2>Manager name: {manager.name}</h2>
        <h2>Leader name: {leader.name}</h2>
      </div>
      <KanbanBoard
        // TODO: use `role`
        tasks={tasks}
      />
    </main>
  );
}

const includeProjectTaskInfo = {
  assignee: {
    select: {
      id: true,
      name: true,
    },
  },
  tags: {
    select: {
      name: true,
    },
  },
} satisfies Prisma.ProjectTaskInclude;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await unstable_getServerSession(context.req, context.res, authOptions);

  if (!session || !session.user) {
    return { notFound: true };
  }

  const user = session.user as SessionUser;

  const { id } = context.params!;
  const decodedId = hashids.decode(id as string);

  const projectId = decodedId[0] as number | undefined;

  // no need to handle projectId being undefined because because should just return null
  const project = await prisma.project.findUnique({
    where: {
      id: projectId,
    },
    include: {
      manager: {
        select: {
          id: true,
          name: true,
        },
      },
      leader: {
        select: {
          id: true,
          name: true,
        },
      },
      members: {
        select: {
          id: true,
        },
      },
    },
  });

  if (!project) return {
    props: {
      session,
      user,
      project: null,
    },
  };

  if (!userHasAccessToProject(user.id, project)) return {
    props: {
      session,
      user,
      noAccess: true,
    },
  };

  const role = getUserRoleInProject(user.id, project)!;

  const canSeeAllTasks = role === ProjectRole.MANAGER || role == ProjectRole.LEADER;

  let tasks: ProjectTaskInfo[];

  if (canSeeAllTasks) {
    const result = await prisma.project.findUniqueOrThrow({
      where: {
        id: projectId,
      },
      select: {
        tasks: {
          include: {
            ...includeProjectTaskInfo,
          },
        },
      },
    });
    tasks = result.tasks;
  } else {
    const result = await prisma.user.findUniqueOrThrow({
      where: {
        id: user.id,
      },
      select: {
        tasks: {
          where: {
            projectId,
          },
          include: {
            ...includeProjectTaskInfo,
          },
        },
        permittedTasks: {
          where: {
            projectId,
          },
          include: {
            ...includeProjectTaskInfo,
          },
        },
      },
    });

    const assignedTasks = result.tasks;
    const permittedTasks = result.permittedTasks;

    tasks = assignedTasks.concat(permittedTasks);
  }

  return {
    props: {
      session,
      user,
      project,
      role,
      tasks: toProjectTasks(tasks.map((task) => computeAssignedToMe(task, user.id))),
    },
  };
}

const layout: PageLayout = {
  sidebar: {
    type: SidebarType.PROJECTS,
  },
};
ProjectPage.layout = layout;
