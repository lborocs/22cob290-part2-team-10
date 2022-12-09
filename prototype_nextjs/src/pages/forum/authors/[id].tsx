import type { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { unstable_getServerSession } from 'next-auth/next';

import hashids, { decodeString } from '~/lib/hashids';
import prisma from '~/lib/prisma';
import { asSerializablePost } from '~/lib/posts';
import ErrorPage from '~/components/ErrorPage';
import { SidebarType } from '~/components/Layout';
import ForumSidebar from '~/components/layout/sidebar/ForumSidebar';
import type { AppPage, SessionUser } from '~/types';
import { authOptions } from '~/pages/api/auth/[...nextauth]';

// TODO: AuthorPage
const AuthorPage: AppPage<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ authorId, author }) => {
  if (!author) return (
    <ErrorPage
      title="Author does not exist."
      buttonContent="Authors"
      buttonUrl="/forum/authors"
    />
  );

  const pageTitle = `${author.name} - Make-It-All`;

  return (
    <main className="d-flex flex-column">
      <Head>
        <title>{pageTitle}</title>
      </Head>
      <h1>{author.name}</h1>
      <small>{author.email}</small>

      Number of posts: {author.posts.length}

      <div>
        <h4>Their posts:</h4>
        <div>
          {author.posts.map((post, index) => (
            <div key={index}>
              <Link href={`/forum/posts/${hashids.encode(post.id)}`}>
                {post.history[0].title} (Posted {new Date(post.history[0].date).toLocaleDateString()})
              </Link>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

AuthorPage.layout = {
  sidebar: {
    type: SidebarType.CUSTOM,
    content: <ForumSidebar />,
  },
};

// hashids with string: https://stackoverflow.com/a/27137224

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await unstable_getServerSession(context.req, context.res, authOptions);

  if (!session || !session.user) {
    return { notFound: true };
  }

  const user = session.user as SessionUser;

  const { id } = context.params!;

  const authorId = decodeString(id as string);

  const author = await prisma.user.findUnique({
    where: {
      id: authorId,
    },
    include: {
      posts: {
        include: {
          history: {
            orderBy: {
              date: 'desc',
            },
            take: 1,
            select: {
              date: true,
              title: true,
            },
          },
        },
      },
    },
  });

  // need to make posts serializable
  const result = author
    ? {
      ...author,
      posts: author?.posts.map(asSerializablePost),
    }
    : author;

  return {
    props: {
      session,
      user,
      authorId,
      author: result,
    },
  };
}

export default AuthorPage;
