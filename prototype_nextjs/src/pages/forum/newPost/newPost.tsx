import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from 'next';
import { unstable_getServerSession } from 'next-auth/next';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ForumSidebar from '~/components/layout/sidebar/ForumSidebar';
import Grid from '@mui/material/Grid';
import axios from 'axios';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { SidebarType } from '~/components/Layout';
import type { AppPage, SessionUser } from '~/types';
import { authOptions } from '~/pages/api/auth/[...nextauth]';
import {
  Editor,
  parsePost,
  useEditorStore,
  usePostStore,
  useTopicStore,
} from '~/components/forum/ForumGlobals';
import styles from '~/styles/Forum.module.css';
import Link from '~/components/Link';
import { useEffect } from 'react';
import prisma from '~/lib/prisma';

const NewPost: AppPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ topics }) => {
  const { content, setContent } = useEditorStore();
  const { filteredPosts, setFilteredPosts } = usePostStore();
  const setFilteredTopics = useTopicStore((state) => state.setFilteredTopics);

  useEffect(() => {
    setFilteredTopics(topics.map((topic) => topic.name));
  });

  return (
    <Box className={styles.newPostPage}>
      <Typography variant="h3" sx={{ marginBottom: '10px' }}>
        New post
      </Typography>
      <form
        onSubmit={async (event) => {
          event.preventDefault();

          const formData = new FormData(event.currentTarget);
          const topics_ = (formData.get('tags') as string)
            .split(',')
            .map((topic: string) => topic.trim())
            .filter((topic: string) => topic !== '');

          const { data: post } = await axios.post('/api/posts/addPost', {
            title: formData.get('title') as string,
            topics: topics_,
            content,
            summary: formData.get('summary') as string,
          });

          // display new post even if filtering
          setFilteredPosts([parsePost(post), ...filteredPosts]);
          setContent('');
          window.location.replace('/forum');
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
              <Link href="/forum">
                <ArrowBackIosIcon className={styles.backArrow} />
              </Link>
            </Grid>
            <Grid item xs="auto">
              <Link
                className={`${styles.footerP} ${styles.backPrompt}`}
                href="/forum"
                sx={{ textDecoration: 'none' }}
              >
                Back to posts
              </Link>
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
};

NewPost.layout = {
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
  const topics = await prisma.postTopic.findMany();

  return {
    props: {
      session,
      user,
      topics,
    },
  };
}

export default NewPost;
