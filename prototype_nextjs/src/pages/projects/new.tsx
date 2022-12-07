import type { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import Head from 'next/head';
import { unstable_getServerSession } from 'next-auth/next';

import { SidebarType } from '~/components/Layout';
import type { AppPage, SessionUser } from '~/types';
import { authOptions } from '~/pages/api/auth/[...nextauth]';

// TODO: NewProjectPage
const NewProjectPage: AppPage<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ }) => {

  return (
    <main>
      <Head>
        <title>New Project - Make-It-All</title>
      </Head>
      {/* TODO */}
      <h1>New project...</h1>
    </main>
  );
};

NewProjectPage.layout = {
  sidebar: {
    type: SidebarType.PROJECTS,
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

export default NewProjectPage;
