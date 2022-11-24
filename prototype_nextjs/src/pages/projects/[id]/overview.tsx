/* eslint-disable @typescript-eslint/no-unused-vars */ // TODO: remove once this is done
import type { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import Head from 'next/head';
import { unstable_getServerSession } from 'next-auth/next';

import Layout from '~/components/Layout';
import { Role } from '~/types';
import { authOptions } from '~/pages/api/auth/[...nextauth]';
import { ssrGetUserInfo } from '~/server/utils';
import { getProjectInfo } from '~/server/store/projects';

// TODO: ProjectOverviewPage
export default function ProjectOverviewPage({ user, projectInfo }: InferGetServerSidePropsType<typeof getServerSideProps>) {
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
          <div className="d-flex flex-column">
            <p>Manager: {manager}</p>
            <p>Leader: {leader}</p>
            <p>
              Members: {members.map((member, index) => <span key={index}>{member}</span>)}
            </p>
          </div>
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

  // TODO?: should we show an error page instead or redirecting to `/projects` if the project doesn't exist?
  if (!projectInfo) {
    return {
      redirect: {
        destination: '/projects',
        permanent: false,
      },
    };
  }

  return {
    props: {
      session,
      user,
      projectInfo,
    },
  };
}
