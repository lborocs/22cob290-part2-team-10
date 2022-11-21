import type { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import { unstable_getServerSession } from 'next-auth/next';

import Layout from '~/components/Layout';
import { authOptions } from '~/pages/api/auth/[...nextauth]';
import { getUserInfo } from '~/server/store/users';
import { getProjectInfo } from '~/server/store/projects';

// TODO: components/Task
// TODO: components/Kanban

// TODO: project page (Projects page from before)
export default function ProjectPage({ user, projectInfo }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  if (!user) return null;

  return (
    <Layout user={user} sidebarType='projects'>
      <main>
        <h1>{projectInfo.name}</h1>
      </main>
    </Layout>
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
      projectInfo: projectInfo!,
    },
  };
}
