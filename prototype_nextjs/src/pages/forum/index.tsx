import { useEffect } from 'react';
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from 'next';
import Head from 'next/head';
import { getServerSession } from 'next-auth/next';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import SearchIcon from '@mui/icons-material/Search';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { SidebarType } from '~/components/Layout';
import ForumSidebar from '~/components/layout/sidebar/ForumSidebar';
import type { AppPage, SessionUser } from '~/types';
import { authOptions } from '~/pages/api/auth/[...nextauth]';
import prisma from '~/lib/prisma';
import {
  getFilteredPosts,
  usePostStore,
  useTitleStore,
  TopicWrack,
  useTopicStore,
  activeTopics,
  parsePost,
} from '~/components/forum/ForumGlobals';
import styles from '~/styles/Forum.module.css';
import Link from '~/components/Link';

type SsrProps = InferGetServerSidePropsType<typeof getServerSideProps>;
export type ForumPost = SsrProps['posts'][number];

function PostWrack({ posts }: { posts: ForumPost[] }) {
  return (
    <Grid
      container
      spacing={3}
      className={styles.postWrack}
      sx={{
        maxHeight: {
          xs: 630,
          md: 1000,
        },
      }}
    >
      {posts.map((post) => {
        const editor = post.history.at(-1)?.editor?.name;
        const date = post.history.at(-1)?.date;

        return (
          <Grid item xs={12} key={post.id}>
            <Box className={styles.post}>
              <Grid container className={styles.postHeader}>
                <Grid item xs="auto">
                  <p className={styles.topicHeader}>Topics: &ensp;</p>
                </Grid>
                <Grid item xs="auto" container>
                  <TopicWrack topics={post.topics.map((topic) => topic.name)} />
                </Grid>
              </Grid>
              <Box className={styles.postBody}>
                <Link
                  variant="h6"
                  sx={{ width: 'fit-content' }}
                  href={`/forum/wiki/${post.id}`}
                >
                  {post.history.at(-1)?.title}
                </Link>
                <p className={styles.postLog}>
                  Last updated by
                  {' "'}
                  {editor ?? '?'}
                  {'" '}
                  on {date ?? '?'}
                </p>
                <p className={styles.postSummary}>
                  <i>Summary:</i>&ensp;{post.history.at(-1)?.summary}
                </p>
              </Box>
            </Box>
          </Grid>
        );
      })}
    </Grid>
  );
}

const ForumPage: AppPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ posts: posts, topics }) => {
  const { filteredPosts, setFilteredPosts } = usePostStore();
  const setFilteredTopics = useTopicStore((state) => state.setFilteredTopics);
  const { filter, setFilter } = useTitleStore();

  useEffect(() => {
    setFilteredTopics(topics.map((topic) => topic.name));
  });

  useEffect(() => {
    const activeTopics_ = Array.from(activeTopics);
    setFilteredPosts(
      posts.filter((post) => {
        const topics = post.topics.map((topic) => topic.name);
        return (
          post.history
            .at(-1)
            ?.title.toLowerCase()
            .startsWith(filter.toLowerCase()) &&
          activeTopics_.every((topic) => topics.includes(topic))
        );
      })
    );
  }, [posts, setFilteredPosts, setFilteredTopics, filter]);

  return (
    <Container maxWidth="xl" component="main">
      <Head>
        <title>Forum - Make-It-All</title>
      </Head>
      <Box>
        <Grid
          sx={{ marginBottom: 5 }}
          container
          direction="row"
          justifyContent="space-between"
        >
          <Grid xs="auto" item>
            <Link href="/forum/newPost/newPost" sx={{ textDecoration: 'none' }}>
              <button className={styles.newPost}>
                <AttachFileIcon fontSize="small" />
                <span>New post</span>
              </button>
            </Link>
          </Grid>
          <Grid
            container
            className={`${styles.textInput} ${styles.titleSearch}`}
            xs="auto"
            item
          >
            <Grid item xs="auto">
              <SearchIcon sx={{ color: '#d0d7de' }} />
            </Grid>
            <Grid item xs="auto">
              <input
                type="search"
                placeholder="Search post by title..."
                value={filter || ''}
                className={`${styles.innerSearch} ${styles.topicSearch}`}
                onChange={(event) => {
                  setFilter(event.target.value);
                  setFilteredPosts(getFilteredPosts(posts, event.target.value));
                }}
              />
            </Grid>
          </Grid>
        </Grid>
        <PostWrack posts={filteredPosts} />
      </Box>
    </Container>
  );
};

ForumPage.layout = {
  sidebar: {
    type: SidebarType.CUSTOM,
    content: <ForumSidebar />,
  },
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session || !session.user) {
    return { notFound: true };
  }

  const user = session.user as SessionUser;

  const posts = await prisma.post.findMany({
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
  });

  const postsWithInfo = posts.reverse().map(parsePost);
  const topics = await prisma.postTopic.findMany();

  return {
    props: {
      session,
      user,
      posts: postsWithInfo,
      topics,
    },
  };
}

export default ForumPage;
