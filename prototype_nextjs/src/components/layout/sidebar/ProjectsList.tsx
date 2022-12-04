import Link from 'next/link';
import { useRouter } from 'next/router';
import axios from 'axios';
import useSWR from 'swr';

import LoadingPage from '~/components/LoadingPage';
import hashids from '~/lib/hashids';
import type { ResponseSchema as GetProjectsResponse } from '~/pages/api/projects/get-assigned-projects';

import styles from '~/styles/layout/sidebar/ProjectsList.module.css';

// TODO: search bar

// TODO: update styling
// TODO: style scrollbar

const getAssignedProjects = async (url: string) => {
  const { data } = await axios.get<GetProjectsResponse>(url);
  return data;
};

export default function ProjectsList() {
  const router = useRouter();

  const { data: projects, error } = useSWR('/api/projects/get-assigned-projects', getAssignedProjects);

  if (error) return null; // TODO: decide what to show on error
  if (!projects) return <LoadingPage dark={false} />;

  let currentProjectUrl: string | undefined;
  if (router.pathname.startsWith('/projects/[id]')) {
    const { id } = router.query;
    currentProjectUrl = `/projects/${id as string}`;
  }

  return (
    <div>
      <p className={styles.title}>Assigned Projects:</p>
      <div className={`list-unstyled ${styles['projects-list']}`}>
        {projects.map((project, index) => {
          const url = `/projects/${hashids.encode(project.id)}`;
          const active = currentProjectUrl === url;

          return (
            <li key={index}>
              <Link
                href={url}
                className={`${styles['project-link']} ${active ? styles.active : ''}`}
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
