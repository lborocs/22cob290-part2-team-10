import type { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { unstable_getServerSession } from 'next-auth/next';

import { encodeString } from '~/lib/hashids';
import prisma from '~/lib/prisma';
import { SidebarType } from '~/components/Layout';
import ForumSidebar from '~/components/layout/sidebar/ForumSidebar';
import type { AppPage, SessionUser } from '~/types';
import { authOptions } from '~/pages/api/auth/[...nextauth]';

// TODO: AuthorsPage
const AuthorsPage: AppPage<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ }) => {
  // TODO: Link to each other page using `encodeString` for their ID

  return (
    <main>
      <Head>
        <title>Authors - Make-It-All</title>
      </Head>
    </main>
  );
};

AuthorsPage.layout = {
  sidebar: {
    type: SidebarType.CUSTOM,
    content: <ForumSidebar />,
  },
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await unstable_getServerSession(context.req, context.res, authOptions);

  if (!session || !session.user) {
    return { notFound: true };
  }

  const user = session.user as SessionUser;

  // TODO: get authors from database

  return {
    props: {
      session,
      user,
    },
  };
}

export default AuthorsPage;
