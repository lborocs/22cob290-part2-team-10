import type { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { unstable_getServerSession } from 'next-auth/next';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import { encodeString } from '~/lib/hashids';
import prisma from '~/lib/prisma';
import { SidebarType } from '~/components/Layout';
import ForumSidebar from '~/components/layout/sidebar/ForumSidebar';
import type { AppPage, SessionUser } from '~/types';
import { authOptions } from '~/pages/api/auth/[...nextauth]';

// TODO: AuthorsPage
const AuthorsPage: AppPage<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ authors }) => {

  return (
    <main>
      <Head>
        <title>Authors - Make-It-All</title>
      </Head>
      <div className="d-flex flex-column">
        {authors.map((author, index) => (
          <Row key={index}>
            <Col xs={7}>
              <Link
                href={`/forum/authors/${encodeString(author.id)}`}
                style={{
                  color: 'blue',
                }}
              >
                <span className="me-4">
                  {author.name} ({author.email})
                </span>
              </Link>
            </Col>
            <Col>
              Number of posts: {author._count.posts}
            </Col>
            <Col>
              Upvotes received: {author.upvotes}
            </Col>
          </Row>
        ))}
      </div>
    </main>
  );
};

AuthorsPage.layout = {
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

  const authors = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      _count: {
        select: {
          posts: true,
        },
      },
    },
    orderBy: {
      posts: {
        _count: 'desc',
      },
    },
  });

  const totalUpvotes = await prisma.post.groupBy({
    by: [
      'authorId',
    ],
    _sum: {
      upvotes: true,
    },
  });

  const result = authors.map((author) => {
    const groupBy = totalUpvotes.find((groupBy) => groupBy.authorId === author.id);
    const upvotes = groupBy?._sum.upvotes ?? 0;
    return {
      ...author,
      upvotes,
    };
  });

  return {
    props: {
      session,
      user,
      authors: result,
    },
  };
}

export default AuthorsPage;
