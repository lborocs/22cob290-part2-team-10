import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from 'next';
import Head from 'next/head';
import { getServerSession } from 'next-auth/next';
import { signOut } from 'next-auth/react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Stack from '@mui/material/Stack';

import prisma from '~/lib/prisma';
import { getEmailFromToken } from '~/lib/inviteToken';
import { SidebarType } from '~/components/Layout';
import AvatarEditor from '~/components/profile/AvatarEditor';
import UserDetailsSection from '~/components/profile/UserDetailsSection';
import ChangePasswordSection from '~/components/profile/ChangePasswordSection';
import InviteEmployeeSection from '~/components/profile/InviteEmployeeSection';
import type { AppPage, SessionUser } from '~/types';
import { authOptions } from '~/pages/api/auth/[...nextauth]';

import styles from '~/styles/Profile.module.css';

const ProfilePage: AppPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ inviter }) => {
  return (
    <Container
      component="main"
      fixed
      sx={{
        flexGrow: 1,
      }}
    >
      <Head>
        <title>Profile - Make-It-All</title>
      </Head>

      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        gap={{ xs: 3, sm: 2.5 }}
        component="section"
      >
        <Box display="flex" justifyContent="center">
          <AvatarEditor />
        </Box>
        <Box flexGrow={1}>
          <UserDetailsSection inviter={inviter} />
        </Box>
      </Stack>

      <br />
      <br />

      <Grid container columns={{ xs: 1, sm: 2 }} component="section">
        <Grid xs={1} sm={1}>
          <ChangePasswordSection />
        </Grid>
        <Grid xs={1} sm={1}>
          <InviteEmployeeSection />
        </Grid>
      </Grid>

      <br />
      <br />

      <Button
        variant="contained"
        color="error"
        className={styles.button}
        onClick={() => signOut({ callbackUrl: '/' })}
      >
        Sign Out
      </Button>
    </Container>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);

  // not signed in, will be handled by _app
  // use auth's redirection because it provides callback URL
  if (!session || !session.user) {
    return { notFound: true };
  }

  const user = session.user as SessionUser;

  const { inviteToken } = await prisma.user.findUniqueOrThrow({
    where: {
      id: user.id,
    },
    select: {
      inviteToken: true,
    },
  });

  const inviterEmail = getEmailFromToken(inviteToken);

  const inviter = inviterEmail
    ? await prisma.user.findUniqueOrThrow({
        where: {
          email: inviterEmail,
        },
        select: {
          email: true,
          name: true,
        },
      })
    : null;

  return {
    props: {
      session,
      user,
      inviter,
    },
  };
}

ProfilePage.layout = {
  sidebar: {
    type: SidebarType.PROJECTS,
  },
};

export default ProfilePage;
