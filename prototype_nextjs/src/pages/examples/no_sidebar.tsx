import type { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import { unstable_getServerSession } from 'next-auth/next';
import Navbar from 'react-bootstrap/Navbar';

import { SidebarType } from '~/components/Layout';
import type { AppPage, SessionUser } from '~/types';
import { authOptions } from '~/pages/api/auth/[...nextauth]';

const ExamplePage: AppPage = () => {
  return (
    <main>
      <Head>
        <title>No Sidebar - Examples</title>
      </Head>
      <h1>No sidebar example</h1>
    </main>
  );
};

ExamplePage.layout = {
  title: (
    <Navbar.Brand>
      Look no sidebar!
    </Navbar.Brand>
  ),
  sidebar: {
    type: SidebarType.NONE,
  },
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await unstable_getServerSession(context.req, context.res, authOptions);

  if (!session || !session.user) {
    return { notFound: true };
  }

  const user = session.user as SessionUser;

  return {
    props: {
      session,
      user,
    },
  };
}

export default ExamplePage;
