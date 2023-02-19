import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { unstable_getServerSession } from 'next-auth/next';
import hashids, { decodeString } from '~/lib/hashids';

import { encodeString } from '~/lib/hashids';
import prisma from '~/lib/prisma';
import { SidebarType } from '~/components/Layout';
import ForumSidebar from '~/components/layout/sidebar/ForumSidebar';
import type { AppPage, SessionUser } from '~/types';
import { authOptions } from '~/pages/api/auth/[...nextauth]';
import { Prisma } from '@prisma/client';
import { hydrateRoot } from 'react-dom/client';
import {
  ReactElement,
  JSXElementConstructor,
  ReactFragment,
  ReactPortal,
} from 'react';

// TODO: AuthorsPage
const AuthorsPage: AppPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ authorsOfPosts }) => {
  // TODO: Link to each other page using `encodeString` for their ID
  /*  I would like to aplogise in advance for the amount of in document CSS,
  external CSS was not working and time was low 
  it used to be all inline CSS which was tragic,
  thank you Ade, btw*/
  const titleStyle = {
    backgroundColor: '#ddf4ff',
    borderStyle: 'solid',
    fontSize: 'large',
    borderRadius: '20px',
    paddingInline: '15px',
    margin: '0px',
    paddingTop: '1.8px',
    fontWeight: 'bold',
  };
  return (
    <main>
      <Head>
        {/* Doesnt show up, keeping regardless */}
        <title>Authors - Make-It-All</title>
      </Head>
      <span style={titleStyle}>Authors - Make-It-All</span>
      {/* Ignore the errors directly below, please */}
      {authorsOfPosts?.map((authorsOfPosts: {}) => (
        <h3 id="List" key={authorsOfPosts.id}>
          <span
            style={{
              borderStyle: 'solid',
              borderColor: 'solid white',
              borderRadius: '8px',
            }}
          >
            <Link
              href={`/forum/authors/${encodeString(
                authorsOfPosts.id as string
              )}`}
            >
              {authorsOfPosts.name}: click here to see all posts by this author
            </Link>
          </span>
        </h3>
      ))}
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
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );

  if (!session || !session.user) {
    return { notFound: true };
  }

  const user = session.user as SessionUser;

  const nested = await prisma.post.findMany({
    select: { authorId: true },
  });
  const authorsOfPosts: object | null = await prisma.user.findMany({
    where: {
      id: {
        in: nested.map((nested) => nested.authorId),
      },
    },
  });

  return {
    props: {
      session,
      user,
      authorsOfPosts,
    },
  };
}

export default AuthorsPage;
