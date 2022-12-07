import type { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { unstable_getServerSession } from 'next-auth/next';
import type { Prisma } from '@prisma/client';

import hashids from '~/lib/hashids';
import prisma from '~/lib/prisma';
import { getUserRoleInProject } from '~/lib/projects';
import ErrorPage from '~/components/ErrorPage';
import { SidebarType } from '~/components/Layout';
import { authOptions } from '~/pages/api/auth/[...nextauth]';
import { type AppPage, type SessionUser, ProjectRole } from '~/types';

// TODO: ProjectOverviewPage
const ProjectOverviewPage: AppPage<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ project, role }) => {
  const router = useRouter();

  if (!project) return (
    <ErrorPage
      title="Project does not exist."
      buttonContent="Home"
      buttonUrl="/home"
    />
  );

  // only managers & leaders can see the project overview
  if (role !== ProjectRole.MANAGER && role !== ProjectRole.LEADER) return (
    <ErrorPage
      title="You do not have access to this page."
      buttonContent="Project"
      buttonUrl={router.asPath.slice(0, -9)} // remove /overview
    />
  );

  const {
    name,
    manager,
    leader,
    members,
  } = project;

  const pageTitle = `Overview ${name} - Make-It-All`;

  return (
    <main>
      <Head>
        <title>{pageTitle}</title>
      </Head>
      <main>
        <h1>{name}</h1>
        <div className="d-flex flex-column">
          <p>Number of members: {project._count.members}</p>
          <p>Total project tasks: {project._count.tasks}</p>

          <details open>
            <summary><span className="h3">Manager</span></summary>
            <p>Name: {manager.name}</p>
            <p># of tasks: {manager.tasks.length}</p>
          </details>

          <details open>
            <summary><span className="h3">Leader</span></summary>
            <p>Name: {leader.name}</p>
            <p># of tasks: {leader.tasks.length}</p>
          </details>

          <details open>
            <summary><span className="h3">Members</span></summary>
            <ul>
              {members.map((member, index) => (
                <li key={index}>
                  <div>
                    <p>Name: {member.name}</p>
                    <p># of tasks: {member.tasks.length}</p>
                  </div>
                </li>
              ))}
            </ul>
          </details>
        </div>
      </main>
    </main>
  );
};

ProjectOverviewPage.layout = {
  sidebar: {
    type: SidebarType.PROJECTS,
  },
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await unstable_getServerSession(context.req, context.res, authOptions);

  if (!session || !session.user) {
    return { notFound: true };
  }

  const user = session.user as SessionUser;

  const { id } = context.params!;
  const decodedId = hashids.decode(id as string);

  const projectId = decodedId[0] as number | undefined;

  const numberOfTasks = {
    where: {
      projectId,
    },
    select: {
      id: true,
    },
  } satisfies Prisma.ProjectTaskFindManyArgs;

  // TODO: how many tasks a user (team members) is CURRENTLY working on (might have to be another query)
  // and also total number of tasks (so we can do like `completed tasks: 5/30`)

  const project = await prisma.project.findUnique({
    where: {
      id: projectId,
    },
    select: {
      name: true,
      manager: {
        select: {
          id: true,
          name: true,
          tasks: {
            ...numberOfTasks,
          },
        },
      },
      leader: {
        select: {
          id: true,
          name: true,
          tasks: {
            ...numberOfTasks,
          },
        },
      },
      members: {
        select: {
          id: true,
          name: true,
          tasks: {
            ...numberOfTasks,
          },
        },
      },
      _count: {
        select: {
          members: true,
          tasks: true,
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

  const role = getUserRoleInProject(user.id, project);

  return {
    props: {
      session,
      user,
      project,
      role,
    },
  };
}

export default ProjectOverviewPage;
