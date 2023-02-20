import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from 'next';
import Head from 'next/head';
import { getServerSession } from 'next-auth/next';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import { SidebarType } from '~/components/Layout';
import type { AppPage, SessionUser } from '~/types';
import { authOptions } from '~/pages/api/auth/[...nextauth]';
import prisma from '~/lib/prisma';
import hashids from '~/lib/hashids';

import { NextLinkComposed } from '~/components/Link';
import ProgressBar from '~/components/ProjectProgressBar';
import NoProjectsCard, { hasProjectAccess } from '~/components/NoProjectsCard';

const ProjectsPage: AppPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ projects }) => {
  function getNumberofTasks(project: (typeof projects)[number]) {
    // function to get the number of tasks that are incomplete for a project and the total number of tasks
    // for a project. The function returns a JSON object with the number of incomplete tasks and the total number of tasks
    // as the value and max properties respectively. These are then used to render the progress bar
    const totalNumOfTasks = project.tasks.length;

    const inCompletedTasks = project.tasks.filter(
      (task) => task.stage !== 'COMPLETED'
    ).length;

    return { value: inCompletedTasks, max: totalNumOfTasks };
  }

  return (
    <>
      <Head>
        <title>Projects - Make-It-All</title>
      </Head>

      <main>
        {/* If the current user has no projects, the following function brings up a card
        that tells them they do not have any projects */}
        {projects.length === 0 && <NoProjectsCard />}

        {/* The following code renders a list of cards, one for each project that the user has access to.
        Each card displays the project name, the project leader's name, and the number
        of people working on the project. A "View" button on each card links to the project
        detail page */}
        <Container sx={{ py: 5 }} maxWidth="md">
          <Grid container spacing={4}>
            {projects.map((project) => (
              <Grid item key={project.id} xs={12} sm={6} md={4}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    '&:hover': { boxShadow: 6 },
                    paddingBottom: '10%',
                  }}
                >
                  {/* A card is used to display the each project that the current user has assigned to them */}
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Tooltip
                      title={project.name.length > 12 ? project.name : ''}
                    >
                      {/* Tooltip is used to output longer project names using a small pop up badge */}
                      <Typography gutterBottom variant="h5" component="h2">
                        {project.name.length <= 12
                          ? project.name
                          : `${project.name.slice(0, 12)}...`}
                      </Typography>
                    </Tooltip>
                    <Typography>
                      Project led by: {project.leader.name}
                    </Typography>
                    <Typography>
                      People working on project: {project.members.length}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    {/* A "View" button is used to link to the project detail page */}
                    <Button
                      size="small"
                      component={NextLinkComposed}
                      to={`/projects/${hashids.encode(project.id)}`}
                    >
                      View
                    </Button>
                  </CardActions>
                  {/* The progress bar is rendered here */}
                  <ProgressBar {...getNumberofTasks(project)} />{' '}
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </main>
    </>
  );
};

ProjectsPage.layout = {
  sidebar: {
    type: SidebarType.PROJECTS,
  },
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  //used to get the projects from the database and to get the current user session data
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session || !session.user) {
    return { notFound: true };
  }

  const user = session.user as SessionUser;

  let projects = await prisma.project.findMany({
    // used to query the database for the projects and the members assigned to these projects
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

  /// done to filter out the projects that the current employee does not have access to
  projects = projects.filter((project) => hasProjectAccess(project, user));

  return {
    props: {
      session,
      user,
      projects,
    },
  };
}

export default ProjectsPage;
