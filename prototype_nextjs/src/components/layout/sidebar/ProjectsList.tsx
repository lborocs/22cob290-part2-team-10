import { useCallback, useState } from 'react';
import { useRouter } from 'next/router';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import _ from 'lodash';
import useSWR from 'swr';

import hashids from '~/lib/hashids';
import DebouncedTextField from '~/components/DebouncedTextField';
import { NextLinkComposed } from '~/components/Link';
import type { ResponseSchema as GetProjectsResponse } from '~/pages/api/projects/get-assigned-projects';

import styles from '~/styles/layout/sidebar/ProjectsList.module.css';

/**
 * Using memoization for better performance.
 *
 * @see https://javascript.plainenglish.io/how-to-create-an-optimized-real-time-search-with-react-6dd4026f4fa9
 */
const filterProjects = _.memoize((query: string, projects: GetProjectsResponse) => {
  const lcQuery = query.toLowerCase();

  const filteredProjects = projects.filter((project) => project.name.toLowerCase().includes(lcQuery));

  return filteredProjects;
});

export default function ProjectsList() {
  const { data: projects, error } = useSWR('/api/projects/get-assigned-projects', async (url) => {
    const { data } = await axios.get<GetProjectsResponse>(url);
    return data;
  });

  type Projects = NonNullable<typeof projects>;

  const [filteredProjects, setFilteredProjects] = useState<Projects>([]);

  const onSearchSubmit = useCallback(
    (query: string) => projects && setFilteredProjects(filterProjects(query, projects)),
    [projects]
  );

  const resetResults = useCallback(
    () => projects && setFilteredProjects(projects),
    [projects]
  );

  if (error) {
    console.error(error);
    return (
      <Stack height="100%" justifyContent="center">
        <Alert
          variant="filled"
          severity="error"
          sx={{
            marginX: 0.25,
          }}
        >
          Failed to load your assigned projects, please try again.
        </Alert>
      </Stack>
    );
  }

  return (
    <Stack height="100%" paddingTop={1}>
      <DebouncedTextField
        debounceTimeoutMs={600}
        onSearchSubmit={onSearchSubmit}
        resetResults={resetResults}
        id="query"
        label="Search by project name"
        variant="outlined"
        disabled={projects === undefined}
        sx={{
          marginLeft: 0.5,
          marginRight: 1.5,
          marginTop: 1,
          '& label': {
            color: 'black',
          },
          '& label.Mui-focused': {
            color: 'black',
          },
          '& input': {
            color: 'black',
          },
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: 'dark.main',
            },
            '&:hover fieldset': {
              borderColor: 'dark.main',
            },
            '&.Mui-focused fieldset': {
              borderColor: 'dark.main',
            },
          },
        }}
      />

      {/* for some reason the divider's lines are in line with the bottom of
      its content instead of the center. It appears to be because of the parent's
      height 100%. Wrapping it in a div works as a workaround
      */}
      <Box marginY={2.5}>
        <Divider
          role="presentation"
          sx={{
            marginLeft: 1,
            marginRight: 1.5,
            // divider with content colour: https://stackoverflow.com/a/71083943/17381629
            '&::before, &::after': {
              borderColor: 'rgba(0, 0, 0, 0.45)',
            },
          }}
        >
          <Chip
            label="Assigned Projects"
            color="contrast"
            icon={projects ? undefined : <CircularProgress size="1rem" />}
          />
        </Divider>
      </Box>

      <Box position="relative" height="100%" marginRight={0.1}>
        <Box
          position="absolute"
          sx={{
            inset: 0,
            overflowY: 'auto',
            // TODO?: scrollbar styling isnt fully supported on firefox
            // so try and figure out workaround? idk
            // https://developer.mozilla.org/en-US/docs/Web/CSS/::-webkit-scrollbar
            '&::-webkit-scrollbar': {
              width: '0.5em',
            },
            '&::-webkit-scrollbar-track': {
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: 'rgba(0, 0, 0, .1)',
              outline: '1px solid slategrey',
            },
          }}
        >
          <Projects projects={projects && filteredProjects} />
        </Box>
      </Box>
    </Stack>
  );
}

// TODO?: made list bg a different colour?
function Projects({ projects }: {
  projects: GetProjectsResponse | undefined
}) {
  if (!projects) return (
    <List sx={{
      height: '100%',
      overflow: 'hidden',
      marginX: 0.5,
    }}>
      {_.range(10).map((num) => (
        <Skeleton
          key={num}
          width="100%"
          animation="wave"
        >
          <ListItem aria-hidden="true">
            <ListItemText>
              this cannot be empty
            </ListItemText>
          </ListItem>
        </Skeleton>
      ))}
    </List>
  );

  // TODO: look into using react-window (virtualized list) for better performance
  // https://mui.com/material-ui/react-list/#virtualized-list

  return (
    <List>
      {projects.map((project) => (
        <ProjectListItem key={project.id} project={project} />
      ))}
    </List>
  );
}

function ProjectListItem({ project }: { project: GetProjectsResponse[number] }) {
  const router = useRouter();

  let currentProjectUrl: string | undefined;
  if (router.pathname.startsWith('/projects/[id]')) {
    const { id } = router.query;
    currentProjectUrl = `/projects/${id as string}`;
  }

  const url = `/projects/${hashids.encode(project.id)}`;
  const active = currentProjectUrl === url;

  // TODO: some sort of like way to signify that they can hover over it for tooltip
  // maybe underline
  const nameIsTooLong = project.name.length > 18;

  const renderLink = (
    <ListItemButton
      className={`${styles.projectLink} ${active ? styles.active : ''}`}
      component={NextLinkComposed}
      to={{
        pathname: url,
      }}
    >
      <ListItemText>{project.name}</ListItemText>
    </ListItemButton>
  );

  return (
    <ListItem disablePadding>
      {nameIsTooLong ? (
        <Tooltip
          placement="right"
          title={<Typography fontSize="small">{project.name}</Typography>}
        >
          {renderLink}
        </Tooltip>
      ) : renderLink}
    </ListItem>
  );
}
