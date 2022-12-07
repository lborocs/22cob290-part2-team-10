import type { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { unstable_getServerSession } from 'next-auth/next';

import hashids from '~/lib/hashids';
import prisma from '~/lib/prisma';
import { SidebarType } from '~/components/Layout';
import type { AppPage, SessionUser } from '~/types';
import { authOptions } from '~/pages/api/auth/[...nextauth]';

/*
"There should also be a manager’s dashboard so that the managers or team lead‐
ers can keep track of the progression of the project they are responsible for."
- spec letter
*/

// TODO: DashboardPage
const DashboardPage: AppPage<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ managedProjects }) => {

  return (
    <main>
      <Head>
        <title>Dashboard - Make-It-All</title>
      </Head>
      {/* TODO */}
      <h1>Manager dashboard</h1>

      <div>
        <ul>
          {managedProjects.map((project, index) => (
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
};

DashboardPage.layout = {
  sidebar: {
    type: SidebarType.PROJECTS,
  },
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await unstable_getServerSession(context.req, context.res, authOptions);

  if (!session || !session.user) {
    return { notFound: true };
  }

  const user = session.user as SessionUser;

  const managedProjects = await prisma.project.findMany({
    where: {
      managerId: user.id,
    },
    select: {
      id: true,
      name: true,
    },
  });

  return {
    props: {
      session,
      user,
      managedProjects,
    },
  };
}

export default DashboardPage;
