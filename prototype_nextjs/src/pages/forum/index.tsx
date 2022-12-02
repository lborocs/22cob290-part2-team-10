/* eslint-disable @typescript-eslint/no-unused-vars */ // TODO: remove once this is done
import type { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { unstable_getServerSession } from 'next-auth/next';

import { SidebarType, type PageLayout } from '~/components/Layout';
import ForumSidebar from '~/components/layout/sidebar/ForumSidebar';
import hashids from '~/lib/hashids';
import type { Post } from '~/types';
import { authOptions } from '~/pages/api/auth/[...nextauth]';
import { ssrGetUserInfo } from '~/server/utils';
import { getAllPosts } from '~/server/store/posts';

// TODO: ForumPage
export default function ForumPage({ posts }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <main>
      <Head>
        <title>Forum - Make-It-All</title>
      </Head>
      {/* TODO */}
      <ul className="d-flex flex-column">
        {posts.map((post, index) => (
          <li key={index}>
            <ForumPostPreview post={post} />
          </li>
        ))}
      </ul>
    </main>
  );
}

// Dara recommends using something like Luxon (https://github.com/moment/luxon) to display how long ago a post was made (relative)
// and when they hover over it, have a tooltip saying the actual date & time (absolute)

// TODO: implement & move to components/forum
function ForumPostPreview({ post }: { post: Post }) {
  const {
    id,
    author,
    datePosted,
    title,
    content,
    topics,
  } = post;

  return (
    <Link href={`/forum/posts/${hashids.encode(id)}`}>
      <span className="h3">{title}</span>
    </Link>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await unstable_getServerSession(context.req, context.res, authOptions);

  if (!session || !session.user) {
    return { notFound: true };
  }

  const user = await ssrGetUserInfo(session);

  const posts = await getAllPosts();

  return {
    props: {
      session,
      user,
      posts,
    },
  };
}

const layout: PageLayout = {
  sidebar: {
    type: SidebarType.CUSTOM,
    content: <ForumSidebar />,
  },
};
ForumPage.layout = layout;
