import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
  GetServerSideProps,
} from 'next';
import Head from 'next/head';
import { unstable_getServerSession } from 'next-auth/next';

import { SidebarType } from '~/components/Layout';
import type { AppPage, SessionUser } from '~/types';
import { authOptions } from '~/pages/api/auth/[...nextauth]';
import prisma from '~/lib/prisma';

import useUserStore from '~/store/userStore';
import Stafftable from '../components/staff comp/stafftable';

/*
  "There should also be a manager’s dashboard so that the managers or team lead‐
  ers can keep track of the progression of the project they are responsible for."
  - spec letter
  */

const Staff: AppPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ users }) => {
  const isManager = useUserStore((store) => store.user.isManager);

  return (
    <main>
      <Head>
        <title>Staff Page - Make-It-All</title>
      </Head>

      <div>
        <Stafftable users={users} />
      </div>
    </main>
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

  const users = await prisma.user.findMany({
    select: {
      email: true,
      name: true,
      leftCompany: true,
    },
  });

  console.log(users);

  return {
    props: {
      session,
      user,
      users,
    },
  };
}) satisfies GetServerSideProps;

export default Staff;
