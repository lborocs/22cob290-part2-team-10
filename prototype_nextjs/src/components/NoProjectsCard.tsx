import { Paper, Typography } from '@mui/material';
import { SessionUser } from '~/types';

export default function hasNoProjects(
  data: {
    filter: (arg0: (project: string) => any) => {
      (): any;
      new (): any;
      length: number;
    };
  },
  user: SessionUser
) {
  //function used to display a card that shows the user that they have no projects
  //assigned to them. The Card is only returned if the user has no projects
  if (data.filter((project) => hasProjectAccess(project, user)).length == 0) {
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
}
export function hasProjectAccess(
  //A function to filter out the projects that the current user
  //has access to. If the user is either the leader or a member of the project,
  //then they have access to it.
  project: object,
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
