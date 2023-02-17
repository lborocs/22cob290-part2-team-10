import type { InferGetServerSidePropsType } from 'next';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

import type { getServerSideProps } from '~/pages/projects';
import type { SessionUser } from '~/types';

export default function NoProjectsCard() {
  return (
    <Paper
      sx={(theme) => ({
        margin: 'auto',
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

type ProjectType = InferGetServerSidePropsType<
  typeof getServerSideProps
>['projects'][number];

export function hasProjectAccess(
  //A function to filter out the projects that the current user
  //has access to. If the user is either the leader or a member of the project,
  //then they have access to it.
  project: ProjectType,
  user: SessionUser
) {
  if (user.id === project.leaderId) {
    return true;
  }
  for (let j = 0; j < project.members.length; j++) {
    if (user.id === project.members[j].id) {
      return true;
    }
  }
  return false;
}
