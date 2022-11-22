/* eslint-disable @typescript-eslint/no-unused-vars */ // TODO: remove once this is done
import type { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import Head from 'next/head';
import Error from 'next/error';
import { unstable_getServerSession } from 'next-auth/next';

import Layout from '~/components/Layout';
import KanbanBoard from '~/components/KanbanBoard';
import { authOptions } from '~/pages/api/auth/[...nextauth]';
import { getUserInfo } from '~/server/store/users';
import { getProjectInfo } from '~/server/store/projects';

// TODO: project page (Projects page from before)
export default function ProjectPage({ user, projectInfo }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  if (!user) return null;

  if (!projectInfo) {
    return (
      <Error
        statusCode={404}
        title="Project does not exist"
      />
    );
  }

  const {
    name,
    manager,
    leader,
    members,
    todo,
    in_progress,
    code_review,
    completed,
  } = projectInfo;

  return (
    <>
      <Head>
        <title>{name} - Make-It-All</title>
      </Head>
      <Layout user={user} sidebarType="projects">
        <main>
          <h1>{name}</h1>
          <KanbanBoard
            project={projectInfo}
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

  const { name: projectName } = context.params!;

  const projectInfo = await getProjectInfo(projectName as string);

  return {
    props: {
      session,
      user,
      projectInfo,
    },
  };
}
