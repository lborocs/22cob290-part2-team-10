import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from 'next';
import Head from 'next/head';
import { unstable_getServerSession } from 'next-auth/next';
import Typography from '@mui/material/Typography';

import { SidebarType } from '~/components/Layout';
import type { AppPage, SessionUser } from '~/types';
import { authOptions } from '~/pages/api/auth/[...nextauth]';

import { PrismaClient } from '@prisma/client';

//! remove next line if you have any props
// eslint-disable-next-line no-empty-pattern
const add_project: AppPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ projects }) => {
  return (
    <main>
      <Head>
        <title>Add a new project</title>
      </Head>

      <ul>
        {projects.map((item) => (
          <li key="item.id">
            <span>
              <strong>{item.name}</strong>
            </span>
            <span>{item.leader.name}</span>
          </li>
        ))}
      </ul>
    </main>
  );
};

add_project.layout = {
  sidebar: {
    type: SidebarType.PROJECTS,
  },
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );

  if (!session || !session.user) {
    return { notFound: true };
  }

  const user = session.user as SessionUser;

  const projects = await prisma.project.findMany({
    include: {
      leader: true,
    },
  });
  //const users = await prisma.user.findMany();

  return {
    props: {
      session,
      user,
      projects,
      //users,
    },
  };
}

export default add_project;
