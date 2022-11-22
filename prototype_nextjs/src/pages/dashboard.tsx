import type { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import Head from 'next/head';
import { unstable_getServerSession } from 'next-auth/next';

import Layout from '~/components/Layout';
import { authOptions } from '~/pages/api/auth/[...nextauth]';
import { getUserInfo } from '~/server/store/users';

// TODO: DashboardPage
export default function DashboardPage({ user }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  if (!user) return null;

  return (
    <>
      <Head>
        <title>Dashboard - Make-It-All</title>
      </Head>
      <Layout user={user} sidebarType="projects">
        <main>
          {/* TODO */}
        </main>
      </Layout>
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await unstable_getServerSession(context.req, context.res, authOptions);

  // not logged in, will be handled by _app
  // use auth's redirection because it gives callback URL
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
