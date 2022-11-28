import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import axios from 'axios';

import type { ProjectInfo } from '~/types';
import type { ResponseSchema as GetProjectResponse } from '~/pages/api/projects/get-assigned-projects';

import styles from '~/styles/ProjectsList.module.css';

// TODO: search bar

export default function ProjectsList() {
  const router = useRouter();

  const [projects, setProjects] = useState<ProjectInfo[]>([]);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    axios.get<GetProjectResponse>('/api/projects/get-assigned-projects', { signal })
      .then(({ data }) => setProjects(data))
      .catch((e) => console.error(e))
      ;

    return () => {
      controller.abort();
    };
  }, []);

  let route: string | undefined;
  if (router.pathname === '/projects/[id]') {
    const { id } = router.query;
    route = `/projects/${id as string}`;
  }

  return (
    <div>
      <p className={styles.title}>Assigned Projects:</p>
      <div className={`list-unstyled ${styles['projects-list']}`}>
        {projects.map((project, index) => {
          const url = `/projects/${project.id}`;
          const active = route === url;

          return (
            <li key={index}>
              <Link
                href={url}
                className={`nav-link ${styles['project-link']} ${active ? styles.active : ''}`}
              >
                {project.name}
              </Link>
            </li>
          );
        })}
      </div>
    </div>
  );
}
