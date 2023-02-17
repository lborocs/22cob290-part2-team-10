import React, { useState } from 'react';
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from 'next';
import Head from 'next/head';
import { unstable_getServerSession } from 'next-auth/next';

import hashids from '~/lib/hashids';
import prisma from '~/lib/prisma';
import ErrorPage from '~/components/ErrorPage';
import { SidebarType } from '~/components/Layout';
import type { AppPage, SessionUser } from '~/types';
import { authOptions } from '~/pages/api/auth/[...nextauth]';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import styles from '~/styles/Projects.module.css';
import DropTarget from '~/components/ProjectDropTarget';

// TODO: project page (Projects page from before)
const ProjectPage: AppPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ project }) => {
  // TODO: error page if no project with provided ID exists
  // TODO: error page if they can't access this project
  if (!project) {
    return <ErrorPage buttonUrl="" title="Project not found" />;
  }

  const pageTitle = project.name;

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
              <DndProvider backend={HTML5Backend}></DndProvider>
            </Card>
          </Grid>

          <Grid item md={3} xs={12}>
            <Card className={styles.card}>
              <CardHeader
                titleTypographyProps={{ fontSize: 20 }}
                title="In Progress"
              />
              <DndProvider backend={HTML5Backend}></DndProvider>
            </Card>
          </Grid>

          <Grid item md={3} xs={12}>
            <Card className={styles.card}>
              <CardHeader
                titleTypographyProps={{ fontSize: 20 }}
                title="Code Review"
              />
              <DndProvider backend={HTML5Backend}></DndProvider>
            </Card>
          </Grid>

          <Grid item md={3} xs={12}>
            <Card className={styles.card}>
              <CardHeader
                titleTypographyProps={{ fontSize: 20 }}
                title="Completed"
              />
              <DndProvider backend={HTML5Backend}></DndProvider>
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

  const project = await prisma.project.findUnique({
    where: {
      id: projectId, // provide the required id argument here
    },
    select: {
      tasks: {},
    },
  });

  return {
    props: {
      session,
      user,
      project,
    },
  };
}

export default ProjectPage;
