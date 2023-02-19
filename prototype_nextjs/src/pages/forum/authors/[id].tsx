import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from 'next';
import Head from 'next/head';
import { unstable_getServerSession } from 'next-auth/next';

import hashids, { decodeString } from '~/lib/hashids';
import prisma from '~/lib/prisma';
import ErrorPage from '~/components/ErrorPage';
import { SidebarType } from '~/components/Layout';
import ForumSidebar from '~/components/layout/sidebar/ForumSidebar';
import type { AppPage, SessionUser } from '~/types';
import { authOptions } from '~/pages/api/auth/[...nextauth]';
import { useRouter } from 'next/router';
import { Grid, Typography } from '@mui/material';
import { PostAddOutlined } from '@mui/icons-material';

// TODO: AuthorPage

const AuthorPage: AppPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ authorInfo, post, postHistory, postTopic }) => {
  // TODO: show ErrorPage if author doesn't exist
  const pageTitle = authorInfo[0].name + ' - Make-It-All';
  /*  I would like to aplogise in advance for the amount of in document CSS,
  external CSS was not working and time was low 
  it used to be all inline CSS so be thankful,
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
  const postBorder = {
    borderStyle: 'solid',
    borderColor: '#d0d7de',
    borderRadius: '8px',
    backgroundColor: '#ffffff',
  };
  const topicStyle = {
    backgroundColor: '#ddf4ff',
    fontSize: 'small',
    borderRadius: '15px',
    paddingInline: '10px',
    color: '#0969da',
    margin: '0px',
    paddingTop: '1.8px',
    maxHeight: '650px',
  };
  const postTitleStyle = {
    paddingInline: '15px',
    paddingBlock: '8px',
    borderTopRightRadius: '8px',
    borderTopLeftRadius: '8px',
    color: '#0969da',
  };
  const summaryTextStyle = {
    paddingInline: '15px',
    fontWeight: 'normal',
  };
  const postContentStyle = {
    paddingInline: '15px',
    paddingBlock: '10px',
    color: '#0969da',
    display: 'none', //Think it looks better like this
  };
  return (
    <main className="d-flex flex-column">
      <Head>
        <link rel="stylesheet" href="styles.css"></link>
        {/* Doesn't show up, keeping regardless */}
        <title>{pageTitle}</title>
      </Head>
      <span style={titleStyle}>{pageTitle}</span>
      <p>Here are all the posts by this author</p>
      {postHistory?.map((postHistory) => {
        const relevantPost = post
          .filter((_post) => _post.id == postHistory.postId)
          ?.at(0);
        return (
          <span>
            <div style={postBorder}>
              <h1 style={topicStyle}>
                Topics:{' '}
                {relevantPost?.topics
                  .map((topic) => topic.name)
                  .reduce((acc, topic) => `${acc}, ${topic}`)}
              </h1>
              <h2 style={postTitleStyle}>{postHistory.title}</h2>
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
            </div>
            <p></p>
          </span>
        );
      })}
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

  // TODO: get author info from database
  // & their posts

  // Get the query parameter from the URL

  const authorId = decodeString(id as unknown as string);
  const authorInfo = await prisma.user.findMany({
    where: {
      id: {
        in: authorId,
      },
    },
  });
  const post = await prisma.post.findMany({
    where: {
      authorId: {
        in: authorId,
      },
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

  //TODO: get topic info and link to posts
  const postTopic = await prisma.postTopic.findMany({});

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

