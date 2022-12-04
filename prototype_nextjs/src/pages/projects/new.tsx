import type { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import Head from 'next/head';
import { unstable_getServerSession } from 'next-auth/next';

import { SidebarType, type PageLayout } from '~/components/Layout';
import type { SessionUser } from '~/types';
import { authOptions } from '~/pages/api/auth/[...nextauth]';

// TODO: NewProjectPage
export default function NewProjectPage({ }: InferGetServerSidePropsType<typeof getServerSideProps>) {

  return (
    <main>
      <Head>
        <title>New Project - Make-It-All</title>
      </Head>
      {/* TODO */}
      <h1>New project...</h1>
    </main>
  );
}

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

const layout: PageLayout = {
  sidebar: {
    type: SidebarType.PROJECTS,
  },
};
NewProjectPage.layout = layout;
