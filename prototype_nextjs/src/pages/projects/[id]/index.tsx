import { useEffect, useState } from 'react';
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from 'next';
import Head from 'next/head';
import { unstable_getServerSession } from 'next-auth/next';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import type { Prisma } from '@prisma/client';

import hashids from '~/lib/hashids';
import prisma from '~/lib/prisma';
import { SidebarType } from '~/components/Layout';
import DropTarget from '~/components/project/ProjectDropTarget';
import type { AppPage, SessionUser } from '~/types';
import { authOptions } from '~/pages/api/auth/[...nextauth]';

import styles from '~/styles/Projects.module.css';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

// TODO: link to Overview page for leader & managers

type SsrProps = InferGetServerSidePropsType<typeof getServerSideProps>;

export type ProjectTask = SsrProps['tasks'][number];

const ProjectPage: AppPage<SsrProps> = ({ project, tasks: _tasks }) => {
  const pageTitle = `${project.name} - Make-It-All`;

  const [tasks, setTasks] = useState(_tasks);

  useEffect(() => {
    setTasks(_tasks);
  }, [_tasks]);

  return (
    <main>
      <Head>
        <title>{pageTitle}</title>
      </Head>

      <Container className={styles.content}>
        <Box sx={{ fontWeight: 'bold' }}>
          <Typography variant="h4" component="div">
            {project.name}
          </Typography>
        </Box>

        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="flex-start"
          spacing={3}
        >
          <Grid item md={3} xs={12}>
            <Card className={styles.card}>
              <CardHeader
                titleTypographyProps={{ fontSize: 20 }}
                title="To Do"
              />
              <DndProvider backend={HTML5Backend}>
                <DropTarget tasks={tasks} setTasks={setTasks} stage="TODO" />
              </DndProvider>
            </Card>
          </Grid>

          <Grid item md={3} xs={12}>
            <Card className={styles.card}>
              <CardHeader
                titleTypographyProps={{ fontSize: 20 }}
                title="In Progress"
              />
              <DndProvider backend={HTML5Backend}>
                <DropTarget
                  tasks={tasks}
                  setTasks={setTasks}
                  stage="IN_PROGRESS"
                />
              </DndProvider>
            </Card>
          </Grid>

          <Grid item md={3} xs={12}>
            <Card className={styles.card}>
              <CardHeader
                titleTypographyProps={{ fontSize: 20 }}
                title="Code Review"
              />
              <DndProvider backend={HTML5Backend}>
                <DropTarget
                  tasks={tasks}
                  setTasks={setTasks}
                  stage="CODE_REVIEW"
                />
              </DndProvider>
            </Card>
          </Grid>

          <Grid item md={3} xs={12}>
            <Card className={styles.card}>
              <CardHeader
                titleTypographyProps={{ fontSize: 20 }}
                title="Completed"
              />
              <DndProvider backend={HTML5Backend}>
                <DropTarget
                  tasks={tasks}
                  setTasks={setTasks}
                  stage="COMPLETED"
                />
              </DndProvider>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </main>
  );
};

ProjectPage.layout = {
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

  const { id } = context.params!;
  const decodedId = hashids.decode(id as string);
  const projectId = decodedId[0] as number | undefined;

  if (!projectId) {
    return { notFound: true };
  }

  const project = await prisma.project.findUnique({
    where: {
      id: projectId,
    },
  });

  if (!project) {
    return { notFound: true };
  }

  const canViewAllTasks = user.isManager || project.leaderId === user.id;

  const whereInput: Prisma.ProjectTaskWhereInput = canViewAllTasks
    ? {}
    : {
        OR: [
          {
            permitted: {
              some: { id: user.id },
            },
          },
          {
            assigneeId: user.id,
          },
        ],
      };

  const tasks = await prisma.projectTask.findMany({
    where: {
      projectId,
      ...whereInput,
    },
  });

  const serialisableTasks = tasks.map((task) => ({
    ...task,
    deadline: task.deadline.toISOString(),
  }));

  return {
    props: {
      session,
      user,
      project,
      tasks: serialisableTasks,
    },
  };
}

export default ProjectPage;
