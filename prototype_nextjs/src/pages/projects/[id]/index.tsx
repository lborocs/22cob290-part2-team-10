import { useEffect, useState } from 'react';
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from 'next';
import Head from 'next/head';
import { getServerSession } from 'next-auth/next';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import type { Prisma } from '@prisma/client';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import hashids from '~/lib/hashids';
import prisma from '~/lib/prisma';
import { SidebarType } from '~/components/Layout';
import type { AppPage, SessionUser } from '~/types';
import { authOptions } from '~/pages/api/auth/[...nextauth]';
import DropTarget from '~/components/project/ProjectDropTarget';
import { NextLinkComposed } from '~/components/Link';

import styles from '~/styles/Projects.module.css';

// TODO: add task button for leader & managers (`elevated`)

type SsrProps = InferGetServerSidePropsType<typeof getServerSideProps>;

export type ProjectTask = SsrProps['tasks'][number];

const ProjectPage: AppPage<SsrProps> = ({
  project,
  tasks: _tasks,
  elevated,
}) => {
  const [tasks, setTasks] = useState(_tasks);

  useEffect(() => {
    setTasks(_tasks);
  }, [_tasks]);

  const pageTitle = `${project.name} - Make-It-All`;

  return (
    <Container className={styles.content} component="main">
      <Head>
        <title>{pageTitle}</title>
      </Head>

      <Stack direction="row" fontWeight="bold" marginBottom={2} gap={2}>
        <Typography variant="h4" component="h1">
          {project.name}
        </Typography>
        {elevated && (
          <Button
            variant="contained"
            component={NextLinkComposed}
            to={`/projects/${hashids.encode(project.id)}/overview`}
          >
            See overview
          </Button>
        )}
      </Stack>

      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="flex-start"
        spacing={3}
      >
        <Grid item md={3} xs={12}>
          <Card className={styles.card}>
            <CardHeader titleTypographyProps={{ fontSize: 20 }} title="To Do" />
            <Divider
              orientation="horizontal"
              sx={{
                marginBottom: 1,
              }}
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
            <Divider
              orientation="horizontal"
              sx={{
                marginBottom: 1,
              }}
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
            <Divider
              orientation="horizontal"
              sx={{
                marginBottom: 1,
              }}
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
            <Divider
              orientation="horizontal"
              sx={{
                marginBottom: 1,
              }}
            />
            <DndProvider backend={HTML5Backend}>
              <DropTarget tasks={tasks} setTasks={setTasks} stage="COMPLETED" />
            </DndProvider>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

ProjectPage.layout = {
  sidebar: {
    type: SidebarType.PROJECTS,
  },
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);

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

  const serializableTasks = tasks.map((task) => ({
    ...task,
    deadline: task.deadline.toISOString(),
  }));

  return {
    props: {
      session,
      user,
      project,
      tasks: serializableTasks,
      elevated: canViewAllTasks,
    },
  };
}

export default ProjectPage;
