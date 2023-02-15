import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from 'next';
import Head from 'next/head';
import { unstable_getServerSession } from 'next-auth/next';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';

import { SidebarType } from '~/components/Layout';
import type { AppPage, SessionUser } from '~/types';
import { authOptions } from '~/pages/api/auth/[...nextauth]';
import prisma from '~/lib/prisma';
import SearchAppBar from './dashboardcomp/Searchbar';
import ProjectTable from './dashboardcomp/ProjectTable';
import BasicCard, { type BasicCardProps } from './dashboardcomp/card';

/*
"There should also be a manager’s dashboard so that the managers or team lead‐
ers can keep track of the progression of the project they are responsible for."
- spec letter
*/

// TODO: DashboardPage

const DashboardPage: AppPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ projects }) => {
  // TODO: new project button if manager
  const data: BasicCardProps['data'] = [
    {
      title: 'Average Hours per Task',
      description: '11',
    },
    // {
    //   title: 'Number of tasks',
    //   description: '10',
    // },
  ];

  return (
    <main>
      <Head>
        <title>Dashboard - Make-It-All</title>
      </Head>
      {/* TODO */}
      <div>
        <SearchAppBar />
      </div>
      <div>
        <ProjectTable projects={projects} />
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{
            marginTop: 5,
          }}
        >
          Add Project
        </Button>
      </div>
      <div>
        <br></br>

        <BasicCard data={data} />
      </div>
    </main>
  );
};

DashboardPage.layout = {
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

  // TODO: get all projects if manager
  // else, get all projects where leader

  const projects = await prisma.project.findMany({
    include: {
      leader: true,
      members: true,
      tasks: {
        select: {
          stage: true,
        },
      },
    },
  });

  return {
    props: {
      session,
      user,
      projects,
    },
  };
}

export default DashboardPage;
