import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
  GetServerSideProps,
} from 'next';
import Head from 'next/head';
import { unstable_getServerSession } from 'next-auth/next';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';

import { SidebarType } from '~/components/Layout';
import type { AppPage, SessionUser } from '~/types';
import { authOptions } from '~/pages/api/auth/[...nextauth]';
import prisma from '~/lib/prisma';
import { NextLinkComposed } from '~/components/Link';
import ProjectTable from './dashboardcomp/ProjectTable';
import useUserStore from '~/store/userStore';
import { Prisma } from '@prisma/client';

/*
"There should also be a manager’s dashboard so that the managers or team lead‐
ers can keep track of the progression of the project they are responsible for."
- spec letter
*/

const DashboardPage: AppPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ projects_ }) => {
  const isManager = useUserStore((store) => store.user.isManager);

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
      <div></div>
      <div>
        <ProjectTable projects={projects_} />
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
          deadline: true,
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

  const projects_ = projects.map((data) => {
    return {
      id: data.id,
      leader: data.leader,
      leaderId: data.leaderId,
      name: data.name,
      members: data.members,
      nooftasks: data.tasks.length,
      completedtasks: data.tasks.reduce(
        (n, task) => (task.stage === 'COMPLETED' ? n + 1 : n),
        0
      ),
      deadline: data.tasks
        .reduce((date, task) => {
          const taskdate = new Date(task.deadline);
          return date > taskdate ? date : taskdate;
        }, new Date('30/12/9999'))
        .toDateString(),
    };
  });

  return {
    props: {
      session,
      user,
      projects_,
    },
  };
}) satisfies GetServerSideProps;

export default DashboardPage;
