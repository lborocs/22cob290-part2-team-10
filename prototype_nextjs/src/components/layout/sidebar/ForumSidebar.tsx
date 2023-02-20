import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import SearchIcon from '@mui/icons-material/Search';

import styles from '~/styles/Forum.module.css';
import {
  TopicWrack,
  useTopicStore,
  getTopics,
} from '~/components/forum/ForumGlobals';
import Link from '~/components/Link';

export default function ForumSidebar() {
  const { filteredTopics, setFilteredTopics } = useTopicStore();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Link
        sx={{ marginInline: 'auto' }}
        className={styles.redirect}
        href="/forum/authors"
      >
        See all authors
      </Link>
      <br />

      <Grid
        container
        className={`${styles.textInput} ${styles.topicSearchDiv}`}
        direction="row"
        justifyContent="flex-start"
        alignItems="stretch"
      >
        <Grid item xs="auto">
          <SearchIcon sx={{ color: '#d0d7de' }} />
        </Grid>
        <Grid item xs="auto">
          <input
            type="search"
            placeholder="Search topic..."
            className={`${styles.innerSearch} ${styles.topicSearch}`}
            onChange={(event) => {
              const filteredTopics: string[] = [];
              getTopics().forEach((topic) =>
                topic.toLowerCase().startsWith(event.target.value.toLowerCase())
                  ? filteredTopics.push(topic)
                  : null
              );
              setFilteredTopics(filteredTopics);
            }}
          />
        </Grid>
      </Grid>
      <br />
      <Typography className={styles.topicFilterParagraph}>
        Topic filters
      </Typography>
      <Box sx={{ paddingInline: '20px' }}>
        <TopicWrack topics={filteredTopics} />
      </Box>
    </Box>
  );
}
