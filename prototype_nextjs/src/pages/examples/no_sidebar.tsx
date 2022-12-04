import type { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import { unstable_getServerSession } from 'next-auth/next';

import { SidebarType, type PageLayout } from '~/components/Layout';
import type { SessionUser } from '~/types';
import { authOptions } from '~/pages/api/auth/[...nextauth]';

export default function ExamplePage() {
  return (
    <main>
      <Head>
        <title>No Sidebar - Examples</title>
      </Head>
      <h1>No sidebar example</h1>
    </main>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await unstable_getServerSession(context.req, context.res, authOptions);

  if (!session || !session.user) {
    return { notFound: true };
  }

  const user = session.user as SessionUser;

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
  title: 'Look no sidebar!',
  sidebar: {
    type: SidebarType.NONE,
  },
};
ExamplePage.layout = layout;
