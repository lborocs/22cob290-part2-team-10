import type { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import Head from 'next/head';
import { unstable_getServerSession } from 'next-auth/next';

import prisma from '~/lib/prisma';
import { SidebarType } from '~/components/Layout';
import ForumSidebar from '~/components/layout/sidebar/ForumSidebar';
import type { AppPage, SessionUser } from '~/types';
import { authOptions } from '~/pages/api/auth/[...nextauth]';

// TODO: ForumPage
const ForumPage: AppPage<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ }) => {
  // TODO: top10voted?
  // TODO: option to list the posts only by this user (can be a different page)

  return (
    <main>
      <Head>
        <title>Forum - Make-It-All</title>
      </Head>
    </main>
  );
};

ForumPage.layout = {
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

  // TODO: use prisma to get forum posts from database

  // TODO: convert each post's date from `Date` to number because Date isn't serializable
  // can use `lib/posts#serializablePost`

  return {
    props: {
      session,
      user,
    },
  };
}

export default ForumPage;
