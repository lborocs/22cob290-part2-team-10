import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from 'next';
import Head from 'next/head';
import { unstable_getServerSession } from 'next-auth/next';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import { SidebarType } from '~/components/Layout';
import type { AppPage, SessionUser } from '~/types';
import { authOptions } from '~/pages/api/auth/[...nextauth]';
import prisma from '~/lib/prisma';
import hashids from '~/lib/hashids';
import { NextLinkComposed } from '~/components/Link';

const ProjectsPage: AppPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ data, user }) => {
  // TODO: filtering should be server side
  function hasProjectAccess(
    //A function to filter out the projects that the current user
    //has access to. If the user is either the leader or a member of the project,
    //then they have access to it.
    project: (typeof data)[number]
  ) {
    if (user.id == project.leaderId) {
      return true;
    }
    for (let j = 0; j < project.members.length; j++) {
      if (user.id == project.members[j].id) {
        return true;
      }
    }
    return false;
  }

  // TODO: make this a component, it's basically being used as one
  // but react is currently treating it as a hook
  function hasNoProjects() {
    //function used to display a card that shows the user that they have no projects
    //assigned to them. The Card is only returned if the user has no projects
    if (data.filter((project) => hasProjectAccess(project)).length == 0) {
      console.log('has no projects');
      return (
        <Paper
          sx={(theme) => ({
            position: 'relative',
            inset: 0,
            margin: 'auto',
            height: 'fit-content',
            width: {
              xs: '85vw',
              sm: '70vw',
              md: '50vw',
              lg: '45vw',
              xl: '35vw',
            },
            padding: {
              xs: 3,
              md: 8,
            },
            borderRadius: 3,
            [theme.getColorSchemeSelector('light')]: {
              bgcolor: theme.vars.palette.makeItAllGrey.main,
              boxShadow: 3,
            },
          })}
        >
          <Typography
            fontSize="2rem"
            fontWeight="lighter"
            textAlign="center"
            color="contrast.main"
          >
            You do not have any projects assigned...
          </Typography>
        </Paper>
      );
    }
  }

  return (
    <>
      <Head>
        <title>Projects - Make-It-All</title>
      </Head>

      <main>
        {/* If the current user has no projects, the following function brings up a card
        that tells them they do not have any projects */}
        {hasNoProjects()}

        {/* The following code renders a list of cards, one for each project that the user has access to.
        Each card displays the project name, the project leader's name, and the number
        of people working on the project. A "View" button on each card links to the project
        detail page */}
        <Container sx={{ py: 5 }} maxWidth="md">
          <Grid container spacing={4}>
            {data
              // TODO: filtering should be done server side
              .filter((project) => hasProjectAccess(project)) /// done to filter out the projects that the current employee does not have access to
              .map((project) => (
                <Grid item key={project.id} xs={12} sm={6} md={4}>
                  <Tooltip title={project.name.length > 12 ? project.name : ''}>
                    {/* Tooltip is used to output longer project names using a small pop up badge */}
                    <Card
                      sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        '&:hover': { boxShadow: 6 },
                      }}
                    >
                      {/* A card is used to display the each project that the current user has assigned to them */}
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Typography gutterBottom variant="h5" component="h2">
                          {project.name.length < 12
                            ? project.name
                            : `${project.name.slice(0, 12)}...`}
                        </Typography>
                        <Typography>
                          Project led by: {project.leader.name}
                        </Typography>
                        <Typography>
                          People working on project: {project.members.length}
                        </Typography>
                      </CardContent>
                      <CardActions>
                        <Button
                          size="small"
                          component={NextLinkComposed}
                          to={`/projects/${hashids.encode(project.id)}`}
                        >
                          View
                        </Button>
                      </CardActions>
                    </Card>
                  </Tooltip>
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
    // used to query the database for the projects and the members assigned to these projects
    include: {
      leader: true,
      members: true,
    },
  });

  return {
    props: {
      session,
      user,
      data: projects,
    },
  };
}

export default ProjectsPage;
