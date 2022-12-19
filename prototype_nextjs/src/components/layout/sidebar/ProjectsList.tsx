import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Skeleton from '@mui/material/Skeleton';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import _ from 'lodash';
import useSWR from 'swr';

import hashids from '~/lib/hashids';
import LoadingPage from '~/components/LoadingPage';
import { NextLinkComposed } from '~/components/Link';
import type { ResponseSchema as GetProjectsResponse } from '~/pages/api/projects/get-assigned-projects';

import styles from '~/styles/layout/sidebar/ProjectsList.module.css';

// TODO: update styling
// TODO: style scrollbar

const DEBOUNCE_TIMEOUT = 600;

// https://mui.com/material-ui/react-skeleton/

// Update the Button's color prop options
declare module '@mui/material/TextField' {
  interface TextFieldPropsColorOverrides {
    makeItAllOrange: true;
  }
}

/**
 * Using debouncing for better performance.
 *
 * @param onSearchSubmit
 * @param resetResults
 * @see https://javascript.plainenglish.io/how-to-create-an-optimized-real-time-search-with-react-6dd4026f4fa9
 */
function SearchBar({ onSearchSubmit, resetResults }: {
  onSearchSubmit(query: string): void
  resetResults(): void
}) {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  // update `query` after `DEBOUNCE_TIMEOUT`ms from last update of `debouncedQuery`
  // i.e. `DEBOUNCE_TIMEOUT`ms after user stopped typing
  useEffect(() => {
    const timer = setTimeout(() => setQuery(debouncedQuery), DEBOUNCE_TIMEOUT);
    return () => clearTimeout(timer);
  }, [debouncedQuery]);

  useEffect(() => {
    if (query) {
      onSearchSubmit(query);
    } else {
      resetResults();
    }
  }, [query, onSearchSubmit, resetResults]);

  // TODO: want input's outline to be greyish

  return (
    <TextField
      id="query"
      label="Search by name"
      variant="outlined"
      value={debouncedQuery}
      onChange={(e) => setDebouncedQuery(e.target.value)}
      sx={(theme) => ({
        marginLeft: theme.spacing(0.5),
        marginRight: theme.spacing(1.5),
        my: theme.spacing(1),
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
            borderColor: theme.palette.dark.main,
            // color: 'black',
          },
          '&:hover fieldset': {
            borderColor: theme.palette.dark.main,
            // borderColor: 'black',
          },
          '&.Mui-focused fieldset': {
            borderColor: theme.palette.dark.main,
            // borderColor: 'black',
          },
        },
      })}
    />
  );
}

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

  const [filteredProjects, setFilteredProjects] = useState<NonNullable<typeof projects>>([]);

  // TODO: decide what to show on error
  if (error) return null;

  // TODO: show skeleton
  if (!projects) return (
    <LoadingPage dark={false} />
  );

  const onSearchSubmit = (query: string) => setFilteredProjects(filterProjects(query, projects));

  const resetResults = () => setFilteredProjects(projects);

  // TODO: look into using react-window (virtualized list)
  // https://mui.com/material-ui/react-list/#virtualized-list

  return (
    <div>
      <Typography
        fontSize="large"
        sx={{
          padding: 1,
        }}
      >
        Assigned Projects:
      </Typography>

      <SearchBar
        onSearchSubmit={onSearchSubmit}
        resetResults={resetResults}
      />

      <List
        className={styles.projectsList}
      // dense
      >
        {filteredProjects.map((project, index) => (
          <ProjectListItem key={index} project={project} />
        ))}
      </List>
    </div>
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
    <ListItem disablePadding disableGutters>
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
