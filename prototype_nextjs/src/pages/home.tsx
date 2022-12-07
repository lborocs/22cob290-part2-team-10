import type { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import Head from 'next/head';
import { unstable_getServerSession } from 'next-auth/next';

import prisma from '~/lib/prisma';
import { SidebarType } from '~/components/Layout';
import type { AppPage, SessionUser } from '~/types';
import { authOptions } from '~/pages/api/auth/[...nextauth]';

// TODO: HomePage
const HomePage: AppPage<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ }) => {

  return (
    <main>
      <Head>
        <title>Home - Make-It-All</title>
      </Head>
      {/* TODO */}
    </main>
  );
};

HomePage.layout = {
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

  // TODO: get their todo list from prisma

  return {
    props: {
      session,
      user,
    },
  };
}

export default HomePage;
