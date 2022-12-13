import type { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import Head from 'next/head';
import { unstable_getServerSession } from 'next-auth/next';

import hashids, { decodeString } from '~/lib/hashids';
import prisma from '~/lib/prisma';
import ErrorPage from '~/components/ErrorPage';
import { SidebarType } from '~/components/Layout';
import ForumSidebar from '~/components/layout/sidebar/ForumSidebar';
import type { AppPage, SessionUser } from '~/types';
import { authOptions } from '~/pages/api/auth/[...nextauth]';

// TODO: AuthorPage
const AuthorPage: AppPage<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ authorId }) => {
  // TODO: show ErrorPage if author doesn't exist

  const pageTitle = '[AUTHOR NAME] - Make-It-All';

  return (
    <main className="d-flex flex-column">
      <Head>
        <title>{pageTitle}</title>
      </Head>
    </main>
  );
};

AuthorPage.layout = {
  sidebar: {
    type: SidebarType.CUSTOM,
    content: <ForumSidebar />,
  },
};

// hashids with string: https://stackoverflow.com/a/27137224

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await unstable_getServerSession(context.req, context.res, authOptions);

  if (!session || !session.user) {
    return { notFound: true };
  }

  const user = session.user as SessionUser;

  const { id } = context.params!;

  const authorId = decodeString(id as string);

  // TODO: get author info from database
  // & their posts

  return {
    props: {
      session,
      user,
      authorId,
    },
  };
}

export default AuthorPage;
