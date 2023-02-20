import { useEffect, useMemo, useState } from 'react';
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from 'next';
import Head from 'next/head';
import { getServerSession } from 'next-auth/next';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { Remarkable } from 'remarkable';

import { SidebarType } from '~/components/Layout';
import ForumSidebar from '~/components/layout/sidebar/ForumSidebar';
import type { AppPage, SessionUser } from '~/types';
import { authOptions } from '~/pages/api/auth/[...nextauth]';
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
  useEditorStore,
} from '~/components/forum/ForumGlobals';

import styles from '~/styles/Forum.module.css';
import type { Prisma } from '@prisma/client';

type SsrProps = InferGetServerSidePropsType<typeof getServerSideProps>;

export type ForumPost = SsrProps['posts'][number];

const parsePost = (
  post: Prisma.PostGetPayload<{
    select: {
      id: true;
      authorId: true;
      author: true;
      topics: true;
      // using to check if upvoted by this user
      upvoters: {
        select: {
          id: true;
        };
      };
      _count: {
        select: {
          // using to get the number of upvotes
          upvoters: true;
        };
      };
      history: {
        include: {
          editor: {
            select: {
              name: true;
            };
          };
        };
      };
    };
  }>
) => ({
  _count: {
    upvoters: post._count.upvoters,
  },
  id: post.id,
  author: post.author,
  topics: post.topics,
  history: post.history.map((history) => {
    return {
      content: history.content,
      editorId: history.editorId,
      postId: history.postId,
      id: history.id,
      summary: history.summary,
      title: history.title,
      date: new Date(history.date).toDateString(),
      editor: history.editor,
    };
  }),
  upvotedByMe: post.upvoters.length > 0,
  upvoters: post._count.upvoters,
});

function PostWrack({ posts }: { posts: ForumPost[] }) {
  const setPage = usePageStore((state) => state.setPage);

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
            <AttachFileIcon fontSize="small" />
            <span>New post</span>
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
  const { page, setPage } = usePageStore();

  const id = Number(page.slice(5, -1));

  const posts = useAllPostsStore((state) => state.posts);
  const setPosts = useAllPostsStore((state) => state.setPosts);

  const post = useMemo(
    () => posts.filter((post) => post.id === id).at(0),
    [posts, id]
  );

  const [state, setState] = useState<string>(
    `${styles.vote}${post?.upvotedByMe ? ` ${styles.activeVote}` : ''}`
  );

  const editor = post?.history.at(-1)?.editor?.name;

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
                const choice = state !== styles.vote;
                setState(
                  `${styles.vote}${choice ? '' : ` ${styles.activeVote}`}`
                );
                setPosts(
                  posts.map((post_) => {
                    if (post_.id === post.id) {
                      return {
                        ...post_,
                        upvoters: post.upvoters + (choice ? -1 : 1),
                        upvotedByMe: !choice,
                      };
                    }
                    return post_;
                  })
                );
                await axios.post('api/posts/updateVotes', {
                  postId: id,
                  remove: choice,
                });
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
  const { content, setContent } = useEditorStore();
  const { posts, setPosts } = useAllPostsStore();
  const { filteredPosts, setFilteredPosts } = usePostStore();
  const setFilteredTopics = useTopicStore((state) => state.setFilteredTopics);

  if (page !== 'newPost') {
    return <></>;
  }

  return (
    <Box className={styles.newPostPage}>
      <Typography variant="h3" sx={{ marginBottom: '10px' }}>
        New post
      </Typography>
      <form
        onSubmit={async (event) => {
          event.preventDefault();

          const formData = new FormData(event.currentTarget);
          const topics = (formData.get('tags') as string)
            .split(',')
            .map((topic: string) => topic.trim())
            .filter((topic: string) => topic !== '');

          const { data: post } = await axios.post('api/posts/addPost', {
            title: formData.get('title') as string,
            topics,
            content,
            summary: formData.get('summary') as string,
          });

          topics.forEach((topic) => getTopics().add(topic));
          setFilteredTopics(Array.from(getTopics()));

          const p = parsePost(post);
          setPosts([p, ...posts]);
          // display new post even if filtering
          setFilteredPosts([p, ...filteredPosts]);

          (event.target as HTMLFormElement).reset();
          setContent('');
          setPage('post');
        }}
      >
        <Box className={`${styles.textInput}`} sx={{ marginBottom: '5px' }}>
          <input
            type="text"
            name="title"
            placeholder="Post title..."
            className={`${styles.innerSearch} ${styles.newPostField}`}
            required
          />
        </Box>
        <Box className={`${styles.textInput}`} sx={{ marginBottom: '5px' }}>
          <input
            type="text"
            name="tags"
            placeholder="Post tags (comma separated)..."
            className={`${styles.innerSearch} ${styles.newPostField}`}
          />
        </Box>
        <Box className={`${styles.textInput}`} sx={{ marginBottom: '8px' }}>
          <input
            type="text"
            name="summary"
            placeholder="Post summary..."
            className={`${styles.innerSearch} ${styles.newPostField}`}
            required
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
    <Container maxWidth="xl" component="main">
      <Head>
        <title>Forum - Make-It-All</title>
      </Head>
      <PostPage />
      <WikiPage />
      <NewPostPage />
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
      topics: topics.map((topic) => topic.name),
    },
  };
}

export default ForumPage;
