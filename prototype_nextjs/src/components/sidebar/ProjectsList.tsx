import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import axios from 'axios';

import styles from '~/styles/ProjectsList.module.css';

export default function ProjectsList() {
  const { data: session, status } = useSession();

  console.log('ProjectsList.session =', session);
  const [projects, setProjects] = useState<string[]>([]);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    axios.get<string[]>('/api/projects/getAssignedProjects', { signal })
      .then(({ data }) => setProjects(data))
      .catch((e) => { })
      ;

    return () => {
      controller.abort();
    };
  }, []);

  if (status !== 'authenticated') return null;

  return (
    <div className={styles['sidebar-list']}>
      <p>Assigned Projects:</p>
      <ul className="list-unstyled">
        {projects.map((projectName, index) => (
          <li key={index}>
            <Link href={`project/${projectName}`}>{projectName}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
