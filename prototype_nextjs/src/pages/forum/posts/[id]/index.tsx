import type { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { unstable_getServerSession } from 'next-auth/next';

import hashids from '~/lib/hashids';
import prisma from '~/lib/prisma';
import ErrorPage from '~/components/ErrorPage';
import { SidebarType } from '~/components/Layout';
import ForumSidebar from '~/components/layout/sidebar/ForumSidebar';
import type { AppPage, SessionUser } from '~/types';
import { authOptions } from '~/pages/api/auth/[...nextauth]';

// TODO: PostPage
const PostPage: AppPage<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ post, authoredByMe }) => {
  const router = useRouter();

  if (!post) return (
    <ErrorPage
      title="Post does not exist."
      buttonContent="Forum"
      buttonUrl="/forum"
    />
  );

  const {
    author,
    datePosted,
    title,
    summary,
    content,
    topics,
    upvotes,
  } = post;

  const pageTitle = `${title} - Make-It-All`;
  const date = new Date(datePosted);

  // TODO share button (copy URL)

  return (
    <main>
      <Head>
        <title>{pageTitle}</title>
      </Head>
      {/* TODO */}
      <div className="d-flex justify-content-between">
        <h1>{title}</h1>

        <div>
          Votes: {upvotes}
        </div>

        <div>
          {authoredByMe && (
            <Link href={`${router.asPath}/edit`}>
              <button>
                Edit
              </button>
            </Link>
          )}
        </div>
      </div>

      <span>
        <span><strong>Topics: </strong></span>
        {topics.map((topic, index) => (
          <span className="me-1" key={index}>{topic.name}</span>
        ))}
      </span>
      <p>Author: {author.name}</p>
      <p><small>Summary: {summary}</small></p>
      <p>Posted: {date.toLocaleDateString()}</p>

      <textarea value={content} readOnly />
    </main >
  );
};

PostPage.layout = {
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

export default PostPage;
