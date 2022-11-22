import type { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import { unstable_getServerSession } from 'next-auth/next';

import Layout from '~/components/Layout';
import { authOptions } from '~/pages/api/auth/[...nextauth]';
import { getUserInfo } from '~/server/store/users';

export default function ExamplePage({ user }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  if (!user) return null;

  return (
    <Layout user={user} sidebarType="projects">
      <main>
        <h1>Assigned projects sidebar example</h1>
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

  return {
    props: {
      session,
      user,
    },
  };
}