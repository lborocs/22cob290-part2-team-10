import type { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { unstable_getServerSession } from 'next-auth/next';

import hashids from '~/lib/hashids';
import prisma from '~/lib/prisma';
import ErrorPage from '~/components/ErrorPage';
import { SidebarType } from '~/components/Layout';
import ForumSidebar from '~/components/layout/sidebar/ForumSidebar';
import type { AppPage, SessionUser } from '~/types';
import { authOptions } from '~/pages/api/auth/[...nextauth]';

// TODO: EditPostPage
const EditPostPage: AppPage<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ post, authoredByMe }) => {
  const router = useRouter();

  if (!post) return (
    <ErrorPage
      title="Post does not exist."
      buttonContent="Forum"
      buttonUrl="/forum"
    />
  );

  if (!authoredByMe) return (
    <ErrorPage
      title="You cannot edit this post."
      buttonContent="Post"
      buttonUrl={router.asPath.slice(0, -5)} // remove /edit
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
};

EditPostPage.layout = {
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

  const { id } = context.params!;
  const decodedId = hashids.decode(id as string);

  const postId = decodedId[0] as number | undefined;

  const post = await prisma.post.findUnique({
    where: {
      id: postId,
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

  if (!post) return {
    props: {
      session,
      user,
      post: null,
    },
  };

  // can't serialize type Date
  const postWithSerializableDate = {
    ...post,
    datePosted: post.datePosted.getTime(),
  };

  const authoredByMe = post.authorId === user.id;

  return {
    props: {
      session,
      user,
      post: postWithSerializableDate,
      authoredByMe,
    },
  };
}

export default EditPostPage;
