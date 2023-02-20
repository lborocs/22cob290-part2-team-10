import type { InferGetServerSidePropsType, GetServerSideProps } from 'next';
import Head from 'next/head';
import { getServerSession } from 'next-auth/next';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import AddIcon from '@mui/icons-material/Add';
import type { Prisma } from '@prisma/client';

import { SidebarType } from '~/components/Layout';
import type { AppPage, SessionUser } from '~/types';
import { authOptions } from '~/pages/api/auth/[...nextauth]';
import prisma from '~/lib/prisma';
import { NextLinkComposed } from '~/components/Link';
import ProjectTable from '../components/dashboardcomp/ProjectTable';
import useUserStore from '~/store/userStore';
import NoProjectsCard from '~/components/NoProjectsCard';

/*
"There should also be a manager’s dashboard so that the managers or team lead‐
ers can keep track of the progression of the project they are responsible for."
- spec letter
*/

const DashboardPage: AppPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ projects }) => {
  const isManager = useUserStore((store) => store.user.isManager);

  return (
    <Container component="main" maxWidth="xl" fixed>
      <Head>
        <title>Dashboard - Make-It-All</title>
      </Head>
      <Typography variant="h4" component="h1" gutterBottom>
        {isManager ? 'All ' : 'Your led '}
        projects
      </Typography>

      {projects.length === 0 ? (
        <NoProjectsCard>
          {isManager
            ? 'There are no projects'
            : 'You are not leading any projects...'}
        </NoProjectsCard>
      ) : (
        <ProjectTable projects={projects} />
      )}

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
    </Container>
  );
};

DashboardPage.layout = {
  sidebar: {
    type: SidebarType.PROJECTS,
  },
};

export const getServerSideProps = (async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);

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

  const _projects = projects.map((data) => {
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
      projects: _projects,
    },
  };
}) satisfies GetServerSideProps;

export default DashboardPage;
