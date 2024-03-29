import { forwardRef, useCallback, useState } from 'react';
import { useRouter } from 'next/router';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import InputAdornment from '@mui/material/InputAdornment';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';
import memoize from 'lodash/memoize';
import range from 'lodash/range';
import useSWR from 'swr';

import hashids from '~/lib/hashids';
import useUserStore from '~/store/userStore';
import DebouncedTextField from '~/components/DebouncedTextField';
import { NextLinkComposed } from '~/components/Link';
import type { ResponseSchema as GetProjectsResponse } from '~/pages/api/projects/get-assigned-projects';

/**
 * Using memoization for better performance.
 *
 * @see https://javascript.plainenglish.io/how-to-create-an-optimized-real-time-search-with-react-6dd4026f4fa9
 */
const filterProjects = memoize(
  (query: string, projects: GetProjectsResponse) => {
    const lcQuery = query.toLowerCase();

    const filteredProjects = projects.filter((project) =>
      project.name.toLowerCase().includes(lcQuery)
    );

    return filteredProjects;
  }
);

export default function ProjectsList() {
  const userId = useUserStore((state) => state.user.id);

  const { data: projects, error } = useSWR(
    [userId, '/api/projects/get-assigned-projects'],
    async ([, url]) => {
      const { data } = await axios.get<GetProjectsResponse>(url);
      return data;
    }
  );

  type Projects = NonNullable<typeof projects>;

  const [filteredProjects, setFilteredProjects] = useState<Projects>([]);

  const onSearchSubmit = useCallback(
    (query: string) => setFilteredProjects(filterProjects(query, projects!)),
    [projects]
  );

  const resetResults = useCallback(
    () => setFilteredProjects(projects!),
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
        type="search"
        label="Search by project name"
        variant="outlined"
        disabled={projects === undefined}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon fontSize="small" />
            </InputAdornment>
          ),
        }}
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
            caretColor: 'currentColor',
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
            // note: scrollbar styling isn't fully supported on firefox
            // https://developer.mozilla.org/en-US/docs/Web/CSS/::-webkit-scrollbar
            '&::-webkit-scrollbar': {
              width: '0.5em',
            },
            '&::-webkit-scrollbar-track': {},
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

// TODO?: make list bg a different colour?
function Projects({ projects }: { projects: GetProjectsResponse | undefined }) {
  if (!projects)
    return (
      <List
        sx={{
          height: '100%',
          overflow: 'hidden',
          marginX: 0.5,
        }}
      >
        {range(10).map((num) => (
          <Skeleton key={num} width="100%" animation="wave">
            <ListItem aria-hidden="true">
              <ListItemText>this cannot be empty</ListItemText>
            </ListItem>
          </Skeleton>
        ))}
      </List>
    );

  return (
    <List>
      {projects.map((project) => (
        <ProjectListItem key={project.id} project={project} />
      ))}
    </List>
  );
}

function ProjectListItem({
  project,
}: {
  project: GetProjectsResponse[number];
}) {
  const router = useRouter();

  let currentProjectUrl: string | undefined;
  if (router.pathname.startsWith('/projects/[id]')) {
    const { id } = router.query;
    currentProjectUrl = `/projects/${id as string}`;
  }

  const url = `/projects/${hashids.encode(project.id)}`;
  const active = currentProjectUrl === url;

  const nameIsTooLong = project.name.length > 18;

  return (
    <ListItem disablePadding>
      {nameIsTooLong ? (
        <Tooltip
          placement="right"
          title={<Typography fontSize="small">{project.name}</Typography>}
        >
          <ProjectLink active={active} url={url}>
            <ListItemText primary={`${project.name.slice(0, 18)}...`} />
          </ProjectLink>
        </Tooltip>
      ) : (
        <ProjectLink active={active} url={url}>
          <ListItemText primary={project.name} />
        </ProjectLink>
      )}
    </ListItem>
  );
}

const ProjectLink = forwardRef(function ProjectLink(
  {
    active,
    url,
    children,
    ...props
  }: React.PropsWithChildren<{
    active: boolean;
    url: string;
  }>,
  ref: React.Ref<HTMLAnchorElement>
) {
  return (
    <ListItemButton
      sx={{
        whiteSpace: 'nowrap',
        overflowX: 'hidden',
        textOverflow: 'ellipsis',

        ':hover': {
          bgcolor: '#e2ba3990', // darker makeItAllOrange.main
          color: 'white',
        },
        ...(active && {
          bgcolor: 'makeItAllOrange.main',
          color: 'white',
          ':hover': {
            bgcolor: 'makeItAllOrange.main', // darker makeItAllOrange.main
            color: 'white',
          },
        }),
      }}
      component={NextLinkComposed}
      to={url}
      ref={ref}
      {...props}
    >
      {children}
    </ListItemButton>
  );
});
