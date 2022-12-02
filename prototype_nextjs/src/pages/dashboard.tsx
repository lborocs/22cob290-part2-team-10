import type { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { unstable_getServerSession } from 'next-auth/next';

import { SidebarType, type PageLayout } from '~/components/Layout';
import hashids from '~/lib/hashids';
import { authOptions } from '~/pages/api/auth/[...nextauth]';
import { ssrGetUserInfo } from '~/server/utils';
import { getAssignedProjects } from '~/server/store/projects';

// TODO: DashboardPage
export default function DashboardPage({ projects }: InferGetServerSidePropsType<typeof getServerSideProps>) {

  return (
    <main>
      <Head>
        <title>Dashboard - Make-It-All</title>
      </Head>
      {/* TODO */}
      <h1>Manager/team leader dashboard</h1>

      <div>
        <ul>
          {projects.map((project, index) => (
            <Link key={index} href={`/projects/${hashids.encode(project.id)}/overview`}>
              <li>
                {project.name}
              </li>
            </Link>
          ))}
        </ul>
      </div>

      <Link href="projects/new">
        <button>
          New project
        </button>
      </Link>
    </main>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await unstable_getServerSession(context.req, context.res, authOptions);

  if (!session || !session.user) {
    return { notFound: true };
  }

  const user = await ssrGetUserInfo(session);

  // TODO: create new func getManagedProjects or something like that
  const projects = await getAssignedProjects(user.email);

  return {
    props: {
      session,
      user,
      projects,
    },
  };
}

const layout: PageLayout = {
  sidebar: {
    type: SidebarType.PROJECTS,
  },
};
DashboardPage.layout = layout;
