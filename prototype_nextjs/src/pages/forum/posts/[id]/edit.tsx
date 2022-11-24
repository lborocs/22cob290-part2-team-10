import type { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import Head from 'next/head';
import Error from 'next/error';
import { unstable_getServerSession } from 'next-auth/next';

import Layout from '~/components/Layout';
import ForumSidebar from '~/components/layout/sidebar/ForumSidebar';
import { authOptions } from '~/pages/api/auth/[...nextauth]';
import { ssrGetUserInfo } from '~/server/utils';
import { getPost } from '~/server/store/posts';

// TODO: EditPostPage
export default function EditPostPage({ post }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  if (!post) {
    return (
      <Error
        statusCode={404}
        title="Post does not exist"
      />
    );
  }

  const {
    title,
  } = post;

  const pageTitle = `Edit ${title} - Make-It-All`;

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
      </Head>
      <Layout
        sidebarType="custom"
        sidebarContent={
          <ForumSidebar />
        }
      >
        <main>
          {/* TODO */}
        </main>
      </Layout>
    </>
  );
}

// TODO
export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await unstable_getServerSession(context.req, context.res, authOptions);

  if (!session || !session.user) {
    return { notFound: true };
  }

  const user = await ssrGetUserInfo(session);

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
