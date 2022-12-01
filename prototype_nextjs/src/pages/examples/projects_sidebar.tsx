import type { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import { unstable_getServerSession } from 'next-auth/next';

import { SidebarType } from '~/components/Layout';
import { authOptions } from '~/pages/api/auth/[...nextauth]';
import { ssrGetUserInfo } from '~/server/utils';

export default function ExamplePage() {
  return (
    <main>
      <Head>
        <title>Projects Sidebar - Examples</title>
      </Head>
      <h1>Assigned projects sidebar example</h1>
    </main>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await unstable_getServerSession(context.req, context.res, authOptions);

  if (!session || !session.user) {
    return { notFound: true };
  }

  const user = await ssrGetUserInfo(session);

  return {
    props: {
      session,
      user,
    },
  };
}

ExamplePage.sidebarType = SidebarType.PROJECTS;
