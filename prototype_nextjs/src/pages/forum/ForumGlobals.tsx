/* eslint-disable react-hooks/rules-of-hooks */
import Grid from '@mui/material/Grid';
import { create } from 'zustand';
import type { ResponseSchema } from '../api/posts/getPosts';
import styles from '~/styles/Forum.module.css';
import Box from '@mui/material/Box';
import TerminalRoundedIcon from '@mui/icons-material/TerminalRounded';
import Typography from '@mui/material/Typography';
import RemoveRedEyeRoundedIcon from '@mui/icons-material/RemoveRedEyeRounded';
import CodeMirror from '@uiw/react-codemirror';
import { langs } from '@uiw/codemirror-extensions-langs';
import { Remarkable } from 'remarkable';
import { useState } from 'react';

type postStore = {
  filteredPosts: ResponseSchema;
  setFilteredPosts: (topics: ResponseSchema) => void;
};
type titleStore = {
  filter: string;
  setFilter: (filter: string) => void;
};
type topicStore = {
  filteredTopics: string[];
  setFilteredTopics: (topics: string[]) => void;
};
type pageStore = {
  page: string;
  setPage: (page: string) => void;
};
type editorStore = {
  content: string;
  setContent: (content: string) => void;
};
type _postStore = {
  posts: ResponseSchema;
  setPosts: (posts: ResponseSchema) => void;
};

const activeTopics = new Set<string>();
const topics = new Set<string>();
const use_PostStore = create<_postStore>((set) => ({
  posts: [],
  setPosts: (posts) => set(() => ({ posts })),
}));
const useTopicStore = create<topicStore>((set) => ({
  filteredTopics: [],
  setFilteredTopics: (filteredTopics) => set(() => ({ filteredTopics })),
}));
const usePostStore = create<postStore>((set) => ({
  filteredPosts: [],
  setFilteredPosts: (filteredPosts) => set(() => ({ filteredPosts })),
}));
const useTitleStore = create<titleStore>((set) => ({
  filter: '',
  setFilter: (filter) => set(() => ({ filter })),
}));
const usePageStore = create<pageStore>((set) => ({
  page: 'post',
  setPage: (page) => set(() => ({ page })),
}));
const useContentStore = create<pageStore>((set) => ({
  page: 'code',
  setPage: (page) => set(() => ({ page })),
}));
const useEditorStore = create<editorStore>((set) => ({
  content: '',
  setContent: (content) => set(() => ({ content })),
}));

function EditorContent({ page }: { page: string }) {
  const { content, setContent } = useEditorStore();
  const parser = new Remarkable();
  if (page == 'code') {
    return (
      <CodeMirror
        value={content}
        height="455px"
        extensions={[langs.markdown()]}
        onChange={(value, _) => {
          setContent(value);
        }}
      />
    );
  } else {
    return (
      <Box
        className={styles.preview}
        dangerouslySetInnerHTML={{
          __html: parser.render(content),
        }}
      />
    );
  }
}

export function Editor() {
  const active = `${styles.editorButton} ${styles.activeEditorButton}`;
  const [state1, setState1] = useState<string>(active);
  const [state2, setState2] = useState<string>(styles.editorButton);
  const { page, setPage } = useContentStore();
  return (
    <Box className={styles.editor}>
      <Grid container className={styles.editorHeader}>
        <Grid
          container
          item
          xs="auto"
          className={state1}
          onClick={() => {
            if (page != 'code') {
              setState2(styles.editorButton);
              setState1(active);
              setPage('code');
            }
          }}
        >
          <Grid item xs="auto">
            <TerminalRoundedIcon />
          </Grid>
          <Grid item xs="auto">
            <Typography>&ensp;Edit markdown</Typography>
          </Grid>
        </Grid>
        <Grid
          container
          item
          xs="auto"
          className={state2}
          onClick={() => {
            if (page != 'preview') {
              setState1(styles.editorButton);
              setState2(`${active} ${styles.activePreviewButton}`);
              setPage('preview');
            }
          }}
        >
          <Grid item xs="auto">
            <RemoveRedEyeRoundedIcon />
          </Grid>
          <Grid item xs="auto">
            <Typography>&ensp;Preview</Typography>
          </Grid>
        </Grid>
      </Grid>
      <EditorContent page={page} />
    </Box>
  );
}

export function TopicWrack({ topics }: { topics: string[] }) {
  const { filteredTopics, setFilteredTopics } = useTopicStore();
  const { setFilteredPosts } = getPostStore();
  const activeTopics = getActiveTopics();
  const { filter } = getTitleStore();
  const { page, setPage } = getPageStore();
  return (
    <Grid className={styles.topicWrack} container spacing={0.4}>
      {topics.map((topic) => {
        return (
          // eslint-disable-next-line react/jsx-key
          <Grid item xs="auto">
            <p
              className={`
                ${styles.topic} ${
                activeTopics.has(topic) ? styles.activeTopic : ''
              }
              `}
              onClick={(event) => {
                const topic: string = event.target.outerText;
                if (activeTopics.has(topic)) {
                  activeTopics.delete(topic);
                } else {
                  activeTopics.add(topic);
                }
                setFilteredTopics(filteredTopics);
                setFilteredPosts(getFilteredPosts(filter));
                if (page != 'post') {
                  setPage('post');
                }
              }}
            >
              {topic}
            </p>
          </Grid>
        );
      })}
    </Grid>
  );
}

export function getFilteredPosts(titleFilter: string) {
  const { posts } = get_PostStore();
  const activeTopics_ = Array.from(activeTopics);
  const filteredPosts: ResponseSchema = posts.filter((post) => {
    const topics = post.topics.map((topic) => topic.name);
    return (
      post.history
        .at(-1)
        ?.title.toLowerCase()
        .startsWith(titleFilter.toLowerCase()) &&
      activeTopics_.every((topic) => topics.includes(topic))
    );
  });
  return filteredPosts;
}

export function getActiveTopics() {
  return activeTopics;
}

export function getPostStore() {
  return usePostStore();
}

export function getTitleStore() {
  return useTitleStore();
}

export function getPageStore() {
  return usePageStore();
}

export function getTopicStore() {
  return useTopicStore();
}

export function getTopics() {
  return topics;
}

export function get_PostStore() {
  return use_PostStore();
}
