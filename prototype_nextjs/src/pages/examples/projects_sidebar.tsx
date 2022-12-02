import type { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import { unstable_getServerSession } from 'next-auth/next';

import { SidebarType, type PageLayout } from '~/components/Layout';
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

// we should just be able to do `ExamplePage.layout = { ... } satisfies PageLayout`
// but for some reason it gives error saying SidebarType isn't defined, idk why and cba

const layout: PageLayout = {
  sidebar: {
    type: SidebarType.PROJECTS,
  },
};
ExamplePage.layout = layout;
