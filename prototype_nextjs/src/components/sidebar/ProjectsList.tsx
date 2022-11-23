import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import axios from 'axios';

import type { ResponseSchema as GetProjectResponse } from '~/pages/api/projects/get-assigned-projects';

import styles from '~/styles/ProjectsList.module.css';

export default function ProjectsList() {
  const { status } = useSession();
  const router = useRouter();

  const [projects, setProjects] = useState<string[]>([]);

  useEffect(() => {
    if (status !== 'authenticated') return;

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

  if (status !== 'authenticated') return null;

  let route: string | undefined;
  if (router.pathname === '/projects/[name]') {
    const { name } = router.query;
    route = `/projects/${encodeURIComponent(name as string)}`;
  }

  return (
    <div>
      <p className={styles.title}>Assigned Projects:</p>
      <div className={`list-unstyled ${styles['projects-list']}`}>
        {projects.map((projectName, index) => {
          const url = `/projects/${encodeURIComponent(projectName)}`;
          const active = route === url;

          return (
            <li key={index}>
              <Link
                href={url}
                className={`nav-link ${styles['project-link']} ${active ? styles.active : ''}`}
              >
                {projectName}
              </Link>
            </li>
          );
        })}
      </div>
    </div>
  );
}
