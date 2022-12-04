import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import FormControl from 'react-bootstrap/FormControl';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import axios from 'axios';
import useSWR from 'swr';

import LoadingPage from '~/components/LoadingPage';
import hashids from '~/lib/hashids';
import type { ResponseSchema as GetProjectsResponse } from '~/pages/api/projects/get-assigned-projects';

import styles from '~/styles/layout/sidebar/ProjectsList.module.css';

// TODO: update styling
// TODO: style scrollbar

const getAssignedProjects = async (url: string) => {
  const { data } = await axios.get<GetProjectsResponse>(url);
  return data;
};

export default function ProjectsList() {
  const router = useRouter();

  const { data: projects, error } = useSWR('/api/projects/get-assigned-projects', getAssignedProjects);

  const [query, setQuery] = useState('');

  if (error) return null; // TODO: decide what to show on error
  if (!projects) return <LoadingPage dark={false} />;

  let currentProjectUrl: string | undefined;
  if (router.pathname.startsWith('/projects/[id]')) {
    const { id } = router.query;
    currentProjectUrl = `/projects/${id as string}`;
  }

  const filteredProjects = query
    ? projects.filter((project) => project.name.toLowerCase().includes(query.toLowerCase()))
    : projects;

  return (
    <div>
      <p className={styles.title}>Assigned Projects:</p>

      <div className="ms-1 me-3 my-2">
        <FloatingLabel label="Search by name" controlId="query">
          <FormControl
            placeholder="Query"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </FloatingLabel>
      </div>

      <ol className={`list-unstyled ${styles['projects-list']}`}>
        {filteredProjects.map((project, index) => {
          const url = `/projects/${hashids.encode(project.id)}`;
          const active = currentProjectUrl === url;

          const nameIsTooLong = project.name.length > 20;

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
                  className={`${styles['project-link']} ${active ? styles.active : ''}`}
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
