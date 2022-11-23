import type { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import Head from 'next/head';
import Error from 'next/error';
import { unstable_getServerSession } from 'next-auth/next';

import Layout from '~/components/Layout';
import ForumSidebar from '~/components/sidebar/ForumSidebar';
import { authOptions } from '~/pages/api/auth/[...nextauth]';
import { getUserInfo } from '~/server/store/users';
import { getPost } from '~/server/store/posts';

// TODO: EditPostPage
export default function EditPostPage({ user, post }: InferGetServerSidePropsType<typeof getServerSideProps>) {
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
    title,
  } = post;

  const pageTitle = `Edit ${title} - Make-It-All`;

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
        </main>
      </Layout>
    </>
  );
}

// TODO
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