/* eslint-disable @typescript-eslint/no-unused-vars */ // TODO: remove once this is done
import type { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import Head from 'next/head';
import { unstable_getServerSession } from 'next-auth/next';

import ErrorPage from '~/components/ErrorPage';
import { SidebarType, type PageLayout } from '~/components/Layout';
import { Role } from '~/types';
import { authOptions } from '~/pages/api/auth/[...nextauth]';
import { ssrGetUserInfo } from '~/server/utils';
import { getProjectInfo } from '~/server/store/projects';

// TODO: ProjectOverviewPage
export default function ProjectOverviewPage({ projectInfo }: InferGetServerSidePropsType<typeof getServerSideProps>) {
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

  const pageTitle = `Overview ${name} - Make-It-All`;

  return (
    <main>
      <Head>
        <title>{pageTitle}</title>
      </Head>
      <main>
        <h1>{name}</h1>
        <div className="d-flex flex-column">
          <p>Manager: {manager}</p>
          <p>Leader: {leader}</p>
          <section>
            <p>Members:</p>
            {members.map((member, index) => (
              <p key={index}>{member}</p>
            ))}
          </section>
        </div>
      </main>
    </main>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await unstable_getServerSession(context.req, context.res, authOptions);

  if (!session || !session.user) {
    return { notFound: true };
  }

  const user = await ssrGetUserInfo(session);

  // only managers can see the project overview
  // TODO?: should we show an error page saying they aren't authorised to see this page?
  if (user.role !== Role.MANAGER) {
    return {
      redirect: {
        destination: '/home',
        permanent: false,
      },
    };
  }

  const { id } = context.params!;
  const projectId = id as string;

  // no need to handle projectId being NaN because getProjectInfo should just return null if it's NaN
  const projectInfo = await getProjectInfo(parseInt(projectId));

  return {
    props: {
      session,
      user,
      projectInfo,
    },
  };
}

const layout: PageLayout = {
  sidebar: {
    type: SidebarType.PROJECTS,
  },
};
ProjectOverviewPage.layout = layout;
