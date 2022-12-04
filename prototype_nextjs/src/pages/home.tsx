import type { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import Head from 'next/head';
import { unstable_getServerSession } from 'next-auth/next';

import prisma from '~/lib/prisma';
import { SidebarType, type PageLayout } from '~/components/Layout';
import type { SessionUser } from '~/types';
import { authOptions } from '~/pages/api/auth/[...nextauth]';

// TODO: HomePage
export default function HomePage({ }: InferGetServerSidePropsType<typeof getServerSideProps>) {

  return (
    <main>
      <Head>
        <title>Home - Make-It-All</title>
      </Head>
      {/* TODO */}
    </main>
  );
}

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

const layout: PageLayout = {
  sidebar: {
    type: SidebarType.PROJECTS,
  },
};
HomePage.layout = layout;
