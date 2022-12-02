import type { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import Error from 'next/error';
import Head from 'next/head';
import { unstable_getServerSession } from 'next-auth/next';

import { SidebarType, type PageLayout } from '~/components/Layout';
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
    <main>
      <Head>
        <title>{pageTitle}</title>
      </Head>
      {/* TODO */}
      <h1>Editing {title}</h1>
    </main>
  );
}

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

const layout: PageLayout = {
  sidebar: {
    type: SidebarType.CUSTOM,
    content: <ForumSidebar />,
  },
};
EditPostPage.layout = layout;
