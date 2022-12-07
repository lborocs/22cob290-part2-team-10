import type { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import Head from 'next/head';
import { unstable_getServerSession } from 'next-auth/next';

import prisma from '~/lib/prisma';
import { SidebarType } from '~/components/Layout';
import ForumSidebar from '~/components/layout/sidebar/ForumSidebar';
import ForumPostPreview from '~/components/forum/ForumPostPreview';
import type { AppPage, SessionUser } from '~/types';
import { authOptions } from '~/pages/api/auth/[...nextauth]';

// TODO: ForumPage
const ForumPage: AppPage<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ posts }) => {
  // TODO: top10voted?
  // TODO: option to list the posts only by this user (can be a different page)

  return (
    <main>
      <Head>
        <title>Forum - Make-It-All</title>
      </Head>
      {/* TODO */}
      <div className="d-flex flex-column">
        {posts.map((post, index) => (
          <ForumPostPreview key={index} post={post} />
        ))}
      </div>
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

  const result = await prisma.post.findMany({
    orderBy: {
      datePosted: 'desc',
    },
    include: {
      author: {
        select: {
          name: true,
        },
      },
      topics: true,
    },
  });

  // can't serialize type Date
  const posts = result.map((post) => ({
    ...post,
    datePosted: post.datePosted.getTime(),
  }));

  return {
    props: {
      session,
      user,
      posts,
    },
  };
}

export default ForumPage;
