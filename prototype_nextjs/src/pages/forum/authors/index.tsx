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
              Number of posts: {author.posts.length}
            </Col>
            <Col>
              Upvotes received: {author.totalUpvotes}
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

  // TODO: would like to order by totalUpvotes but not sure how to do that with prisma (in 1 query)

  const result = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      posts: {
        select: {
          _count: {
            select: {
              upvotes: true,
            },
          },
        },
      },
    },
    orderBy: {
      posts: {
        _count: 'desc',
      },
    },
  });

  const authors = result.map((author) => {
    const totalUpvotes = author.posts.reduce((acc, post) => acc + post._count.upvotes, 0);

    return {
      ...author,
      totalUpvotes,
    };
  });

  return {
    props: {
      session,
      user,
      authors,
    },
  };
}

export default AuthorsPage;
