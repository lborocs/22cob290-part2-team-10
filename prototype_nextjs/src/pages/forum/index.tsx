/* eslint-disable react/jsx-key */
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from 'next';
import Head from 'next/head';
import { unstable_getServerSession } from 'next-auth/next';
import { SidebarType } from '~/components/Layout';
import ForumSidebar from '~/components/layout/sidebar/ForumSidebar';
import type { AppPage, SessionUser } from '~/types';
import { authOptions } from '~/pages/api/auth/[...nextauth]';
import { Grid, Typography } from '@mui/material';
import styles from '~/styles/Forum.module.css';
import SearchIcon from '@mui/icons-material/Search';
import {
  getFilteredPosts,
  getPageStore,
  getPostStore,
  getTitleStore,
  TopicWrack,
  getTopics,
  getTopicStore,
  Editor,
  get_PostStore,
} from './ForumGlobals';
import axios from 'axios';
import useSWR from 'swr';
import type { ResponseSchema } from '../api/posts/getPosts';
import { Box } from '@mui/system';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import { Remarkable } from 'remarkable';
import { useState } from 'react';

const users: { name: string; id: string }[] = [];

function PostWrack({ posts }: { posts: ResponseSchema }) {
  const { setPage } = getPageStore();
  return (
    <Grid container spacing={3} className={styles.postWrack}>
      {posts.map((post) => {
        const editor = users
          .filter((user) => user.id == post.history.at(-1)?.editorId)
          .at(0)?.name;
        const date = new Date(post.history.at(-1)!.date);
        return (
          <Grid item xs={12}>
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
                  {editor}
                  {'" '}
                  on {date.toDateString()}
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
  const { filteredPosts, setFilteredPosts } = getPostStore();
  const { page, setPage } = getPageStore();
  const { filter, setFilter } = getTitleStore();

  if (page != 'post') {
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
              type="text"
              placeholder="Search post by title..."
              value={filter ? filter : ''}
              className={`${styles.innerSearch} ${styles.topicSearch}`}
              onChange={(event) => {
                setFilter(event.target.value);
                setFilteredPosts(getFilteredPosts(event.target.value));
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
  const { page, setPage } = getPageStore();

  if (!page.startsWith('wiki')) {
    return <></>;
  }

  const id = Number(page.slice(5, -1));
  const { posts } = get_PostStore();
  const post = posts.filter((post) => post.id == id).at(0);
  const editor = users
    .filter((user) => user.id == post?.history.at(-1)?.editorId)
    .at(0)?.name;
  const date = new Date(post!.history.at(-1)!.date);
  const parser = new Remarkable();

  return (
    <Box>
      <Typography variant="h4">{post?.history.at(-1)?.title}</Typography>
      <hr />
      <Box>
        <p className={styles.postLog}>
          Last updated by
          {' "'}
          {editor}
          {'" '}
          on {date.toDateString()}; Now with {post?.upvoters.length} vote(s)
        </p>
        <Box
          dangerouslySetInnerHTML={{
            __html: parser.render(post!.history.at(-1)!.content),
          }}
        />
      </Box>
      <Typography variant="h5">Topics</Typography>
      <hr />
      <TopicWrack topics={post!.topics.map((topic) => topic.name)} />
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
                if (state != styles.vote) {
                  // if already voted
                  setState(styles.vote);
                } else {
                  setState(`${styles.vote} ${styles.activeVote}`);
                  choice = true;
                }

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
  const { page, setPage } = getPageStore();

  if (page != 'newPost') {
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

// TODO: ForumPage
const ForumPage: AppPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
  // eslint-disable-next-line no-empty-pattern
> = ({}) => {
  // TODO: top10voted?
  // TODO: option to list the posts only by this user (can be a different page)
  const { data: posts_ } = useSWR('/api/posts/getPosts', async (url) => {
    const { data } = await axios.get<ResponseSchema>(url);
    return data;
  });
  const { posts, setPosts } = get_PostStore();
  const { setFilteredTopics } = getTopicStore();

  if (posts.length == 0) {
    setPosts(posts_!);
    if (posts) {
      const topics_ = new Set<string>();
      posts.forEach((post) =>
        post.topics.map((topic) => topics_.add(topic.name))
      );
      topics_.forEach((topic) => getTopics().add(topic));
      setFilteredTopics(Array.from(getTopics()));
    }
  }

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
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );
  if (!session || !session.user) {
    return { notFound: true };
  }

  // TODO: use prisma to get forum posts from database

  // TODO: convert each post's date from `Date` to number because Date isn't serializable
  // can use `lib/posts#serializablePost`

  return {
    props: {
      session,
    },
  };
}

export default ForumPage;
