import { Box, Grid, Typography } from '@mui/material';
import styles from '~/styles/Forum.module.css';
import SearchIcon from '@mui/icons-material/Search';
import {
  TopicWrack,
  getTopicStore,
  getTopics,
} from '~/pages/forum/ForumGlobals';

// TODO: ForumSidebar
export default function ForumSidebar() {
  const { filteredTopics, setFilteredTopics } = getTopicStore();
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
      }}
    >
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
            type="text"
            placeholder="Search topic..."
            className={`${styles.innerSearch} ${styles.topicSearch}`}
            onChange={(event) => {
              setFilteredTopics(
                Array.from(getTopics()).filter((topic) =>
                  topic
                    .toLowerCase()
                    .startsWith(event.target.value.toLowerCase())
                )
              );
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
