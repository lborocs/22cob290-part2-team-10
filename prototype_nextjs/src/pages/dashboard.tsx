import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { unstable_getServerSession } from 'next-auth/next';

import hashids from '~/lib/hashids';
import prisma from '~/lib/prisma';
import { SidebarType } from '~/components/Layout';
import type { AppPage, SessionUser } from '~/types';
import { authOptions } from '~/pages/api/auth/[...nextauth]';
import Table from './dashboardcomp/Projecttable';
import * as React from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';

/*
"There should also be a manager’s dashboard so that the managers or team lead‐
ers can keep track of the progression of the project they are responsible for."
- spec letter
*/

// TODO: DashboardPage
const DashboardPage: AppPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({}) => {
  // TODO: new project button if manager

  return (
    <main>
      <Head>
        <title>Dashboard - Make-It-All</title>
      </Head>
      {/* TODO */}
      <h1>Manager dashboard</h1>
      <div>
      <Table/>

     
      <Stack spacing={5} direction="row">
      <Button variant="contained" startIcon={<AddIcon />}>Add Project</Button>
     
    </Stack>
   
    </div>
      
    </main>
  );
};


DashboardPage.layout = {
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

  // TODO: get all projects if manager
  // else, get all projects where leader

  return {
    props: {
      session,
      user,
    },
  };
}

export default DashboardPage;
