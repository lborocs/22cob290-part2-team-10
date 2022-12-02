import type { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import Error from 'next/error';
import Head from 'next/head';
import { unstable_getServerSession } from 'next-auth/next';

import ErrorPage from '~/components/ErrorPage';
import { SidebarType, type PageLayout } from '~/components/Layout';
import ForumSidebar from '~/components/layout/sidebar/ForumSidebar';
import hashids from '~/lib/hashids';
import { authOptions } from '~/pages/api/auth/[...nextauth]';
import { ssrGetUserInfo } from '~/server/utils';
import { getPost } from '~/server/store/posts';

// TODO: EditPostPage
export default function EditPostPage({ post }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  if (!post) return (
    <ErrorPage
      title="Post does not exist"
      buttonContent="Back to posts"
      buttonUrl="/forum/posts"
    />
  );

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
  const decodedId = hashids.decode(id as string);

  const postId = decodedId[0] as number;

  const post = await getPost(postId);

  // only show this page is this user is the author
  // TODO? or should we show error page?
  // TODO: use userId instead
  if (post?.author !== user.email) return {
    redirect: {
      destination: `/forum/posts/${id as string}`,
      permanent: false,
    },
  };

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
