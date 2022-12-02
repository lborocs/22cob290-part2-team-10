import type { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { unstable_getServerSession } from 'next-auth/next';

import ErrorPage from '~/components/ErrorPage';
import { SidebarType, type PageLayout } from '~/components/Layout';
import ForumSidebar from '~/components/layout/sidebar/ForumSidebar';
import hashids from '~/lib/hashids';
import { authOptions } from '~/pages/api/auth/[...nextauth]';
import { ssrGetUserInfo } from '~/server/utils';
import { getPost } from '~/server/store/posts';

// TODO: PostPage
export default function PostPage({ user, post }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  if (!post) return (
    <ErrorPage
      title="Post does not exist"
      buttonContent="Posts"
      buttonUrl="/forum/posts"
    />
  );

  const router = useRouter();

  const {
    id,
    author,
    datePosted,
    title,
    content,
    topics,
  } = post;

  // TODO: use ID instead
  const userIsAuthor = user.email === author;

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
      {userIsAuthor && (
        <Link href={`${router.asPath}/edit`}>
          <button>
            Edit
          </button>
        </Link>
      )}
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
