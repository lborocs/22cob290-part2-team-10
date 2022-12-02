/* eslint-disable @typescript-eslint/no-unused-vars */ // TODO: remove once this is done
import type { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import Head from 'next/head';
import { unstable_getServerSession } from 'next-auth/next';

import ErrorPage from '~/components/ErrorPage';
import { SidebarType, type PageLayout } from '~/components/Layout';
import KanbanBoard from '~/components/KanbanBoard';
import hashids from '~/lib/hashids';
import { type ProjectInfo, Role } from '~/types';
import { authOptions } from '~/pages/api/auth/[...nextauth]';
import { ssrGetUserInfo } from '~/server/utils';
import { getAssignedTasks, getProjectInfo } from '~/server/store/projects';

// TODO: project page (Projects page from before)
export default function ProjectPage({ projectInfo, tasks }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  if (!projectInfo) return (
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
    members,
  } = projectInfo;

  const pageTitle = `${name} - Make-It-All`;

  return (
    <main>
      <Head>
        <title>{pageTitle}</title>
      </Head>
      <h1>{name}</h1>
      <KanbanBoard
        tasks={tasks}
      />
    </main>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await unstable_getServerSession(context.req, context.res, authOptions);

  if (!session || !session.user) {
    return { notFound: true };
  }

  const user = await ssrGetUserInfo(session);
  const { email } = user;

  const { id } = context.params!;
  const decodedId = hashids.decode(id as string);

  const projectId = decodedId[0] as number; // | undefined

  // no need to handle projectId being undefined because because getProjectInfo should just return null
  const projectInfo = await getProjectInfo(projectId);

  if (!projectInfo) return {
    props: {
      session,
      user,
      projectInfo,
    },
  };

  // TODO: redirect/error page if this user isn't allowed to see this project

  // only show the tasks that the user is allowed to see if they're a team member
  const tasks = user.role === Role.TEAM_MEMBER
    ? await getAssignedTasks(email, projectId)
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

const layout: PageLayout = {
  sidebar: {
    type: SidebarType.PROJECTS,
  },
};
ProjectPage.layout = layout;
