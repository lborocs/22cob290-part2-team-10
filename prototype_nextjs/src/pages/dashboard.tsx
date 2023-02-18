import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
  GetServerSideProps,
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
import { NextLinkComposed } from '~/components/Link';
import Searchbar from './dashboardcomp/Searchbar';
import ProjectTable from './dashboardcomp/ProjectTable';
import BasicCard, { type BasicCardProps } from './dashboardcomp/GenericCard';
import useUserStore from '~/store/userStore';
import { Prisma } from '@prisma/client';
import { Task } from '@mui/icons-material';

/*
"There should also be a manager’s dashboard so that the managers or team lead‐
ers can keep track of the progression of the project they are responsible for."
- spec letter
*/

const DashboardPage: AppPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ projects }) => {
  const isManager = useUserStore((store) => store.user.isManager);
  // const [loading, tasks]

  // const data: BasicCardProps['data'] = [
  //   {
  //     title: 'Average Hours per Task',
  //     ,
  //   },
  //   // {
  //   //   title: 'Number of tasks',
  //   //   description: '10',
  //   // },
  // ];

  //Gets sum of all tasks using card and returns sum of tasks
  function getTasks() {
    console.log('TASKS');
  }
  getTasks();
  return (
    <main>
      <Head>
        <title>Dashboard | Make-It-All</title>
      </Head>
      <div>
        <Searchbar />
      </div>
      <div>
        <ProjectTable projects={projects} />
        {isManager && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={{
              marginTop: 5,
            }}
            component={NextLinkComposed}
            to="/projects/new"
          >
            Add Project
          </Button>
        )}
      </div>
      <Box className="flex flex-col">
        <br></br>

        <BasicCard title={'My Tasks'} total={45} completed={23} />
        <BasicCard title={'Manhours'} total={35} completed={20} />
      </Box>
    </main>
  );
};

DashboardPage.layout = {
  sidebar: {
    type: SidebarType.PROJECTS,
  },
};

export const getServerSideProps = (async (context) => {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );

  if (!session || !session.user) {
    return { notFound: true };
  }

  const user = session.user as SessionUser;

  const getPayload = {
    include: {
      leader: true,
      members: true,
      tasks: {
        select: {
          stage: true,
        },
      },
    },
  } satisfies Prisma.ProjectArgs;

  let projects: Prisma.ProjectGetPayload<typeof getPayload>[];

  if (user.isManager) {
    projects = await prisma.project.findMany({
      ...getPayload,
    });
  } else {
    projects = await prisma.project.findMany({
      ...getPayload,
      where: {
        leaderId: user.id,
      },
    });
  }

  return {
    props: {
      session,
      user,
      projects,
    },
  };
}) satisfies GetServerSideProps;

export default DashboardPage;
