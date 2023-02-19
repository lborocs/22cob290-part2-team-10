import { type CSSProperties, Fragment } from 'react';
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { unstable_getServerSession } from 'next-auth/next';
import { blue, grey } from '@mui/material/colors';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import hashids, { decodeString } from '~/lib/hashids';
import prisma from '~/lib/prisma';
import { SidebarType } from '~/components/Layout';
import ForumSidebar from '~/components/layout/sidebar/ForumSidebar';
import type { AppPage, SessionUser } from '~/types';
import { authOptions } from '~/pages/api/auth/[...nextauth]';
import UserAvatar from '~/components/avatar/UserAvatar';

const AuthorPage: AppPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ authorInfo, post, postHistory, postTopic }) => {
  const pageTitle = `${authorInfo.name} - Make-It-All`;

  /*  I would like to aplogise in advance for the amount of in document CSS,
  external CSS was not working and time was low
  it used to be all inline CSS so be thankful,
  thank you Ade, btw*/
  const topicStyle: CSSProperties = {
    backgroundColor: '#ddf4ff',
    fontSize: 'small',
    borderRadius: '15px',
    paddingInline: '10px',
    color: '#0969da',
    margin: '0px',
    paddingTop: '1.8px',
    maxHeight: '650px',
  };
  const postTitleStyle: CSSProperties = {
    paddingInline: '15px',
    paddingBlock: '8px',
    borderTopRightRadius: '8px',
    borderTopLeftRadius: '8px',
    color: '#0969da',
  };
  const summaryTextStyle: CSSProperties = {
    paddingInline: '15px',
    fontWeight: 'normal',
    // color: 'black',
  };
  const postContentStyle: CSSProperties = {
    paddingInline: '15px',
    paddingBlock: '10px',
    color: '#0969da',
    display: 'none', //Think it looks better like this
  };
  return (
    <main className="d-flex flex-column">
      <Head>
        <title>{pageTitle}</title>
      </Head>

      <UserAvatar
        userId={authorInfo.id}
        name={authorInfo.name}
        image={authorInfo.image}
        sx={{
          marginRight: 2,
        }}
      />
      <Typography
        component="span"
        sx={(theme) => ({
          bgcolor: blue[100],
          borderStyle: 'solid',
          fontSize: 'large',
          borderRadius: '20px',
          paddingInline: '15px',
          margin: '0px',
          paddingTop: '1.8px',
          fontWeight: 'bold',
          [theme.getColorSchemeSelector('dark')]: {
            bgcolor: blue['700'],
          },
        })}
      >
        {pageTitle}
      </Typography>

      <p>Here are all the posts by this author</p>

      <ul
        style={{
          listStyleType: 'none', // Remove bullets
          padding: 0, // Remove padding
          margin: 0, // Remove margins
        }}
      >
        {postHistory?.map((postHistory) => {
          const relevantPost = post
            .filter((_post) => _post.id == postHistory.postId)
            ?.at(0);
          return (
            <Fragment key={postHistory.id}>
              <li>
                <Box
                  component="article"
                  sx={(theme) => ({
                    borderStyle: 'solid',
                    borderColor: '#d0d7de',
                    borderRadius: '8px',
                    [theme.getColorSchemeSelector('dark')]: {
                      bgcolor: grey['800'],
                    },
                  })}
                >
                  <h1 style={topicStyle}>
                    Topics:{' '}
                    {relevantPost?.topics.map((topic) => topic.name).join(', ')}
                  </h1>

                  <h2 style={postTitleStyle}>
                    <Link
                      href={`/forum/posts/${hashids.encode(
                        postHistory.postId
                      )}`}
                    >
                      {postHistory.title}
                    </Link>
                  </h2>

                  <h4 style={summaryTextStyle}>
                    <em
                      style={{
                        fontWeight: 'bold', //summary being in italics and bolded
                      }}
                    >
                      Summary:{' '}
                    </em>
                    {postHistory.summary}
                  </h4>

                  <h3 style={postContentStyle}>{postHistory.content}</h3>
                </Box>
              </li>
              <br />
            </Fragment>
          );
        })}
      </ul>
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
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );

  if (!session || !session.user) {
    return { notFound: true };
  }
  const user = session.user as SessionUser;

  const { id } = context.params!;

  const authorId = decodeString(id as unknown as string);
  const authorInfo = await prisma.user.findUnique({
    where: {
      id: authorId,
    },
  });

  if (!authorInfo) {
    return { notFound: true };
  }

  const post = await prisma.post.findMany({
    where: {
      authorId: authorInfo?.id,
    },
    select: {
      id: true,
      authorId: true,
      author: true,
      topics: true,
      upvoters: true,
    },
  });

  const postHistory = await prisma.postHistory.findMany({
    where: {
      postId: {
        in: post.map((post) => post.id),
      },
    },
    select: {
      id: true,
      postId: true,
      post: true,
      editorId: true,
      editor: true,
      title: true,
      summary: true,
      content: true,
    },
  });

  const postTopic = await prisma.postTopic.findMany();

  return {
    props: {
      session,
      user,
      authorInfo,
      post,
      postHistory,
      postTopic,
    },
  };
}

export default AuthorPage;
