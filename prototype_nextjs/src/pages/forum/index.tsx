import { useEffect, useMemo, useState } from 'react';
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from 'next';
import Head from 'next/head';
import { getServerSession } from 'next-auth/next';
import { SidebarType } from '~/components/Layout';
import ForumSidebar from '~/components/layout/sidebar/ForumSidebar';
import type { AppPage, SessionUser } from '~/types';
import { authOptions } from '~/pages/api/auth/[...nextauth]';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import { Remarkable } from 'remarkable';

import prisma from '~/lib/prisma';
import {
  getFilteredPosts,
  usePageStore,
  usePostStore,
  useTitleStore,
  TopicWrack,
  getTopics,
  useTopicStore,
  Editor,
  useAllPostsStore,
} from './ForumGlobals';

import styles from '~/styles/Forum.module.css';

type SsrProps = InferGetServerSidePropsType<typeof getServerSideProps>;

export type ForumPost = SsrProps['posts'][number];

// TODO: top10voted?

// FIXME: You aren't modifying users anywhere???
const users: { name: string; id: string }[] = [];

function PostWrack({ posts }: { posts: ForumPost[] }) {
  const setPage = usePageStore((state) => state.setPage);

  return (
    <Grid container spacing={3} className={styles.postWrack}>
      {posts.map((post) => {
        // idk wtf you were trying to do here
        // const editor = users
        //   .filter((user) => user.id === post.history.at(-1)?.editorId)
        //   .at(0)?.name;

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
                <Typography
                  variant="h6"
                  sx={{ width: 'fit-content' }}
                  onClick={() => setPage(`wiki[${post.id}]`)}
                >
                  {post.history.at(-1)?.title}
                </Typography>
                <p className={styles.postLog}>
                  Last updated by
                  {' "'}
                  {editor ?? '?'}
                  {'" '}
                  on {date?.toDateString() ?? '?'}
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

function PostPage() {
  const { filteredPosts, setFilteredPosts } = usePostStore();
  const { page, setPage } = usePageStore();
  const { filter, setFilter } = useTitleStore();

  const posts = useAllPostsStore((state) => state.posts);

  if (page !== 'post') {
    return <></>;
  }

  return (
    <Box>
      <Grid
        sx={{ marginBottom: 5 }}
        container
        direction="row"
        justifyContent="space-between"
      >
        <Grid xs="auto" item>
          <button className={styles.newPost} onClick={() => setPage('newPost')}>
            New post
          </button>
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
  );
}

function WikiPage() {
  const [state, setState] = useState<string>(styles.vote);
  const { page, setPage } = usePageStore();

  const id = Number(page.slice(5, -1));

  const posts = useAllPostsStore((state) => state.posts);
  const setPosts = useAllPostsStore((state) => state.setPosts);

  const post = useMemo(
    () => posts.filter((post) => post.id === id).at(0),
    [posts, id]
  );

  // idk wtf you were trying to do here
  // const editor = users
  //   .filter((user) => user.id === post?.history.at(-1)?.editorId)
  //   .at(0)?.name;

  const editor = post?.history.at(-1)?.editor?.name;
  console.log('post.history =', post?.history);

  const date = post?.history?.at(-1)?.date ?? new Date();
  const parser = useMemo(() => new Remarkable(), []);

  useEffect(() => {
    // set 'initial' style state if the post is upvoted by the signed in user
    setState(
      post?.upvotedByMe ? `${styles.vote} ${styles.activeVote}` : styles.vote
    );
  }, [post?.upvotedByMe]);

  if (!page.startsWith('wiki') || !post) {
    return <></>;
  }

  return (
    <Box>
      <Typography variant="h4">{post.history.at(-1)?.title}</Typography>
      <hr />
      <Box>
        <p className={styles.postLog}>
          Last updated by
          {' "'}
          {editor}
          {'" '}
          on {date.toDateString()}; Now with {post.upvoters} vote(s)
        </p>
        <Box
          dangerouslySetInnerHTML={{
            __html: parser.render(post.history.at(-1)!.content),
          }}
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
              <ArrowBackIosIcon
                className={styles.backArrow}
                onClick={() => setPage('post')}
              />
            </Grid>
            <Grid item xs="auto">
              <i
                className={`${styles.footerP} ${styles.backPrompt}`}
                onClick={() => setPage('post')}
              >
                Back to posts
              </i>
            </Grid>
          </Grid>
        </Grid>
        <Grid container xs="auto" item>
          <Grid item>
            <p className={`${styles.footerP}`}>Like what you see? Vote: </p>
          </Grid>
          <Grid xs="auto" item>
            <ThumbUpAltIcon
              className={state}
              onClick={async () => {
                let choice = false;
                if (state !== styles.vote) {
                  // if already voted
                  setState(styles.vote);
                } else {
                  setState(`${styles.vote} ${styles.activeVote}`);
                  choice = true;
                }

                // TODO: update posts array
                // using `setPosts`

                await axios.post('api/posts/updateVotes', {
                  postId: id,
                  add: choice,
                });
                setPage(page);
              }}
            />
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}

export function NewPostPage() {
  const { page, setPage } = usePageStore();

  if (page !== 'newPost') {
    return <></>;
  }

  return (
    <Box className={styles.newPostPage}>
      <Typography variant="h3" sx={{ marginBottom: '10px' }}>
        New post
      </Typography>
      <form>
        <Box className={`${styles.textInput}`} sx={{ marginBottom: '5px' }}>
          <input
            type="text"
            placeholder="Post title..."
            className={`${styles.innerSearch} ${styles.newPostField}`}
            required
          />
        </Box>
        <Box className={`${styles.textInput}`} sx={{ marginBottom: '10px' }}>
          <input
            type="text"
            placeholder="Post tags..."
            className={`${styles.innerSearch} ${styles.newPostField}`}
          />
        </Box>
        <Editor />
        <br />
        <Grid container direction="row" justifyContent="space-between">
          <Grid container item xs="auto">
            <Grid item xs="auto">
              <ArrowBackIosIcon
                className={styles.backArrow}
                onClick={() => setPage('post')}
              />
            </Grid>
            <Grid item xs="auto">
              <i
                className={`${styles.footerP} ${styles.backPrompt}`}
                onClick={() => setPage('post')}
              >
                Back to posts
              </i>
            </Grid>
          </Grid>
          <Grid item xs="auto">
            <button type="submit" className={styles.makePost}>
              Make post
            </button>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
}

const ForumPage: AppPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ posts: _posts, topics }) => {
  const setPosts = useAllPostsStore((state) => state.setPosts);
  const setFilteredPosts = usePostStore((state) => state.setFilteredPosts);
  const setFilteredTopics = useTopicStore((state) => state.setFilteredTopics);

  useEffect(() => {
    setPosts(_posts);
    setFilteredPosts(_posts);
  }, [_posts, setPosts, setFilteredPosts, setFilteredTopics]);

  useEffect(() => {
    const topicsSet = getTopics();

    topics.forEach((topic) => topicsSet.add(topic));
    setFilteredTopics(topics);
  }, [topics, setFilteredTopics]);

  return (
    <main className={styles.main}>
      <Head>
        <title>Forum - Make-It-All</title>
      </Head>
      <PostPage />
      <WikiPage />
      <NewPostPage />
    </main>
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

  const postsWithInfo = posts.map((post) => ({
    ...post,
    upvotedByMe: post.upvoters.length > 0,
    upvoters: post._count.upvoters,
  }));

  const topics = await prisma.postTopic.findMany();

  return {
    props: {
      session,
      user,
      posts: postsWithInfo,
      topics: topics.map((topic) => topic.name),
    },
  };
}

export default ForumPage;
