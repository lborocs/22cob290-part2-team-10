import type { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import Head from 'next/head';
import { unstable_getServerSession } from 'next-auth/next';

import { SidebarType } from '~/components/Layout';
import type { AppPage, SessionUser } from '~/types';
import { authOptions } from '~/pages/api/auth/[...nextauth]';

//! remove next line if you have any props
// eslint-disable-next-line no-empty-pattern
const Page: AppPage<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ }) => {
  return (
    <main>
      <Head>
        <title>Page Template - Examples</title>
      </Head>

      <h1>Page template</h1>
      <span>~ok~</span>
      <button>Example Button</button>
    </main>
  );
};

Page.layout = {
  sidebar: {
    type: SidebarType.PROJECTS,
  },
};

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

export default Page;
