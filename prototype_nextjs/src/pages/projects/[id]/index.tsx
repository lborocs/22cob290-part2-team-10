/* eslint-disable @typescript-eslint/no-unused-vars */ // TODO: remove once this is done
import type { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import Head from 'next/head';
import { unstable_getServerSession } from 'next-auth/next';

import Layout from '~/components/Layout';
import KanbanBoard from '~/components/KanbanBoard';
import { authOptions } from '~/pages/api/auth/[...nextauth]';
import { type ProjectInfo, Role } from '~/types';
import { getUserInfo } from '~/server/store/users';
import { getAssignedTasks, getProjectInfo } from '~/server/store/projects';

// TODO: project page (Projects page from before)
export default function ProjectPage({ user, projectInfo, tasks }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  if (!user) return null;

  const {
    name,
    manager,
    leader,
    members,
  } = projectInfo;

  const pageTitle = `${name} - Make-It-All`;

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
      </Head>
      <Layout user={user} sidebarType="projects">
        <main>
          <h1>{name}</h1>
          <KanbanBoard
            tasks={tasks}
          />
        </main>
      </Layout>
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await unstable_getServerSession(context.req, context.res, authOptions);

  if (!session || !session.user) {
    return { props: {} };
  }

  const email = session.user.email!;
  const user = (await getUserInfo(email))!;

  const { id } = context.params!;
  const projectId = id as string;

  // no need to handle projectId being NaN because getProjectInfo should just return null if it's NaN
  const projectInfo = await getProjectInfo(parseInt(projectId));

  // TODO?: should we show an error page instead or redirecting to `/projects` if the project doesn't exist?
  if (!projectInfo) {
    return {
      redirect: {
        destination: '/projects',
        permanent: false,
      },
    };
  }

  // TODO: redirect/error page if this user isn't allowed to see this project

  // only show the tasks that the user is allowed to see if they're a team member
  const tasks = user.role === Role.TEAM_MEMBER
    ? await getAssignedTasks(email, projectInfo)
    : projectInfo.tasks;

  return {
    props: {
      session,
      user,
      projectInfo: projectInfo as Omit<ProjectInfo, 'tasks'>,
      tasks,
    },
  };
}
