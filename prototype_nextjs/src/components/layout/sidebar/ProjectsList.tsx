import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import FormControl from 'react-bootstrap/FormControl';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import axios from 'axios';
import _ from 'lodash';
import useSWR from 'swr';

import LoadingPage from '~/components/LoadingPage';
import hashids from '~/lib/hashids';
import type { ResponseSchema as GetProjectsResponse } from '~/pages/api/projects/get-assigned-projects';

import styles from '~/styles/layout/sidebar/ProjectsList.module.css';

// TODO: update styling
// TODO: style scrollbar

const DEBOUNCE_TIMEOUT = 600;

// https://mui.com/material-ui/react-skeleton/

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

  return (
    <div className="ms-1 me-3 my-2">
      <FloatingLabel label="Search by name" controlId="query">
        <FormControl
          placeholder="Query"
          value={debouncedQuery}
          onChange={(e) => setDebouncedQuery(e.target.value)}
        />
      </FloatingLabel>
    </div>
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
  const router = useRouter();

  const { data: projects, error } = useSWR('/api/projects/get-assigned-projects', async (url) => {
    const { data } = await axios.get<GetProjectsResponse>(url);
    return data;
  });

  const [filteredProjects, setFilteredProjects] = useState<NonNullable<typeof projects>>([]);

  // TODO: decide what to show on error
  if (error) return null;

  if (!projects) return (
    <LoadingPage dark={false} />
  );

  let currentProjectUrl: string | undefined;
  if (router.pathname.startsWith('/projects/[id]')) {
    const { id } = router.query;
    currentProjectUrl = `/projects/${id as string}`;
  }

  const onSearchSubmit = (query: string) => setFilteredProjects(filterProjects(query, projects));

  const resetResults = () => setFilteredProjects(projects);

  return (
    <div>
      <p className={styles.title}>Assigned Projects:</p>

      <SearchBar
        onSearchSubmit={onSearchSubmit}
        resetResults={resetResults}
      />

      <ol className={`list-unstyled ${styles.projectsList}`}>
        {filteredProjects.map((project, index) => {
          const url = `/projects/${hashids.encode(project.id)}`;
          const active = currentProjectUrl === url;

          // TODO: some sort of like way to signify that they can hover over it for tooltip
          const nameIsTooLong = project.name.length > 18;

          return (
            <li key={index}>
              <OverlayTrigger
                placement="right"
                overlay={nameIsTooLong ? (
                  <Tooltip>
                    {project.name}
                  </Tooltip>
                ) : (
                  <></>
                )}
              >
                <Link
                  href={url}
                  className={`${styles.projectLink} ${active ? styles.active : ''}`}
                >
                  {project.name}
                </Link>
              </OverlayTrigger>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
