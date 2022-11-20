import Link from 'next/link';
import { useSession } from 'next-auth/react';

import { getAssignedProjects } from '~/server/store/projects';

import styles from '~/styles/ProjectsList.module.css';

export default function ProjectsList() {
  const { data: session, status } = useSession();

  console.log('ProjectsList.session = ', session);

  if (status !== 'authenticated') return null;

  const email = session.user!.email!;
  const projects = getAssignedProjects(email);

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
