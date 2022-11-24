/* eslint-disable @typescript-eslint/no-unused-vars */ // TODO: remove once this is done
import type { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { unstable_getServerSession } from 'next-auth/next';

import ForumSidebar from '~/components/sidebar/ForumSidebar';
import Layout from '~/components/Layout';
import type { Post } from '~/types';
import { authOptions } from '~/pages/api/auth/[...nextauth]';
import { ssrGetUserInfo } from '~/server/utils';
import { getAllPosts } from '~/server/store/posts';

// TODO: ForumPage
export default function ForumPage({ posts }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <>
      <Head>
        <title>Forum - Make-It-All</title>
      </Head>
      <Layout
        sidebarType="custom"
        sidebarContent={
          <ForumSidebar />
        }
      >
        <main>
          {/* TODO */}
          {posts.map((post, index) => (
            <ForumPost key={index} post={post} />
          ))}
        </main>
      </Layout>
    </>
  );
}

// Dara recommends using something like Luxon (https://github.com/moment/luxon) to display how long ago a post was made
// and when they hover over it, have a tooltip saying the actual date & time

// TODO
function ForumPost({ post }: { post: Post }) {
  const {
    id,
    author,
    datePosted,
    title,
    content,
    topics,
  } = post;

  return (
    <Link href={`/forum/posts/${id}`}>
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
