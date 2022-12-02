import type { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import Error from 'next/error';
import Head from 'next/head';
import Link from 'next/link';
import { unstable_getServerSession } from 'next-auth/next';

import { SidebarType, type PageLayout } from '~/components/Layout';
import ForumSidebar from '~/components/layout/sidebar/ForumSidebar';
import { authOptions } from '~/pages/api/auth/[...nextauth]';
import { ssrGetUserInfo } from '~/server/utils';
import { getPost } from '~/server/store/posts';

// TODO: PostPage
export default function PostPage({ post }: InferGetServerSidePropsType<typeof getServerSideProps>) {
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
    <main>
      <Head>
        <title>{pageTitle}</title>
      </Head>
      {/* TODO */}
      <h1>{title}</h1>
      <p>Posted: {date.toLocaleDateString()}</p>
      <Link href={`/forum/posts/${id}/edit`}>
        <button>
          Edit
        </button>
      </Link>
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
PostPage.layout = layout;
