import type { InferGetServerSidePropsType, GetServerSideProps } from 'next';
import Head from 'next/head';
import { unstable_getServerSession } from 'next-auth/next';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { SidebarType } from '~/components/Layout';
import type { AppPage, SessionUser } from '~/types';
import { authOptions } from '~/pages/api/auth/[...nextauth]';
import prisma from '~/lib/prisma';

import Stafftable from '~/components/staff comp/stafftable';

/*
  "There should also be a manager’s dashboard so that the managers or team lead‐
  ers can keep track of the progression of the project they are responsible for."
  - spec letter
  */

const Staff: AppPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ users }) => {
  return (
    <Container component="main" maxWidth="xl" fixed>
      <Head>
        <title>Staff Page - Make-It-All</title>
      </Head>

      <Typography variant="h4" component="h1" gutterBottom>
        Staff
      </Typography>

      <Stafftable users={users} />
    </Container>
  );
};

Staff.layout = {
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

  if (!user.isManager) {
    return { notFound: true };
  }

  const users = await prisma.user.findMany({
    select: {
      email: true,
      name: true,
      leftCompany: true,
    },
  });

  return {
    props: {
      session,
      user,
      users,
    },
  };
}) satisfies GetServerSideProps;

export default Staff;
