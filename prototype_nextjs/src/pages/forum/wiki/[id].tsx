import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from 'next';
import { unstable_getServerSession } from 'next-auth/next';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ForumSidebar from '~/components/layout/sidebar/ForumSidebar';
import { useEffect, useMemo } from 'react';
import Grid from '@mui/material/Grid';
import axios from 'axios';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import { Remarkable } from 'remarkable';

import { SidebarType } from '~/components/Layout';
import type { AppPage, SessionUser } from '~/types';
import { authOptions } from '~/pages/api/auth/[...nextauth]';
import {
  parsePost,
  TopicWrack,
  useTopicStore,
} from '~/components/forum/ForumGlobals';
import styles from '~/styles/Forum.module.css';
import Head from 'next/head';
import Link from 'next/link';
import prisma from '~/lib/prisma';

const WikiPage: AppPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ post, topics }) => {
  const setFilteredTopics = useTopicStore((state) => state.setFilteredTopics);
  const editor = post.history.at(-1)?.editor?.name;
  const date = post.history?.at(-1)?.date ?? new Date();
  const parser = useMemo(() => new Remarkable(), []);
  const decorator = `${styles.vote}${
    post.upvotedByMe ? ` ${styles.activeVote}` : ''
  }`;

  useEffect(() => {
    setFilteredTopics(topics.map((topic) => topic.name));
  });

  return (
    <main>
      <Head>
        <title>{`${post.history.at(-1)?.title} - Make-it-all`}</title>
      </Head>
      <Typography variant="h4">{post.history.at(-1)?.title}</Typography>
      <hr />
      <Box>
        <p className={styles.postLog}>
          <>
            Last updated by {' "'}
            {editor}
            {'" '} on {date}; Now with {post.upvoters} vote(s)
          </>
        </p>
        <Box
          dangerouslySetInnerHTML={{
            __html: parser.render(post.history.at(-1)!.content),
          }}
          className={styles.wikiContent}
        />
      </Box>
      <Typography variant="h5">Topics</Typography>
      <hr />
      <TopicWrack topics={post.topics.map((topic) => topic.name)} />
      <br />
      <Grid
        container
        direction="row"
        justifyContent="space-between"
        className={styles.wikiFooter}
      >
        <Grid container xs="auto" item>
          <Grid container item>
            <Grid item xs="auto">
              <Link href="/forum">
                <ArrowBackIosIcon className={styles.backArrow} />
              </Link>
            </Grid>
            <Grid item xs="auto">
              <Link
                href="/forum"
                className={`${styles.footerP} ${styles.backPrompt}`}
              >
                Back to posts
              </Link>
            </Grid>
          </Grid>
        </Grid>
        <Grid container xs="auto" item>
          <Grid item>
            <p className={`${styles.footerP}`}>Like what you see? Vote: </p>
          </Grid>
          <Grid xs="auto" item>
            <Link
              href={`${post.id}`}
              onClick={async () => {
                await axios.post('/api/posts/updateVotes', {
                  postId: post.id,
                  remove: post.upvotedByMe,
                });
              }}
            >
              <ThumbUpAltIcon className={decorator} />
            </Link>
          </Grid>
        </Grid>
      </Grid>
    </main>
  );
};

WikiPage.layout = {
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
  const post = await prisma?.post.findUnique({
    select: {
      id: true,
      authorId: true,
      author: true,
      topics: true,
      // using to check if upvoted by this user
      upvoters: {
        where: {
          id: user.id,
        },
        select: {
          id: true,
        },
      },
      _count: {
        select: {
          // using to get the number of upvotes
          upvoters: true,
        },
      },
      history: {
        include: {
          editor: {
            select: {
              name: true,
            },
          },
        },
      },
    },
    where: {
      id: Number(id),
    },
  });

  const topics = await prisma.postTopic.findMany();

  return {
    props: {
      session,
      user,
      post: parsePost(post!),
      topics,
    },
  };
}

export default WikiPage;
