/* eslint-disable @typescript-eslint/no-unused-vars */ // TODO: remove once this is done
import type { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import Head from 'next/head';
import Error from 'next/error';
import { unstable_getServerSession } from 'next-auth/next';

import Layout from '~/components/Layout';
import ForumSidebar from '~/components/sidebar/ForumSidebar';
import { authOptions } from '~/pages/api/auth/[...nextauth]';
import { getUserInfo } from '~/server/store/users';
import { getPost } from '~/server/store/posts';

// Dara recommends using something like Luxon (https://github.com/moment/luxon) to display how long ago a post was made
// and when they hover over it, have a tooltip saying the actual date & time

// TODO: PostPage
export default function PostPage({ user, post }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  if (!user) return null;

  if (!post) {
    return (
      <Error
        statusCode={404}
        title="Post does not exist"
      />
    );
  }

  const {
    id,
    author,
    datePosted,
    title,
    content,
    topics,
  } = post;

  const pageTitle = `${title} - Make-It-All`;

  const date = new Date(datePosted);

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
      </Head>
      <Layout
        user={user}
        sidebarType="custom"
        sidebarContent={
          <ForumSidebar />
        }
      >
        <main>
          {/* TODO */}
          <h1>{title}</h1>
          Date posted: {date.toUTCString()}
        </main>
      </Layout>
    </>
  );
}


export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await unstable_getServerSession(context.req, context.res, authOptions);

  if (!session || !session.user) {
    return { props: {} };
  }

  const email = session.user.email!;
  const user = (await getUserInfo(email))!;

  const { id } = context.params!;
  const post = await getPost(parseInt(id as string));

  return {
    props: {
      session,
      user,
      post,
    },
  };
}
