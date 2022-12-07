import type { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import Head from 'next/head';
import { unstable_getServerSession } from 'next-auth/next';

import hashids from '~/lib/hashids';
import prisma from '~/lib/prisma';
import ErrorPage from '~/components/ErrorPage';
import { SidebarType } from '~/components/Layout';
import type { AppPage, SessionUser } from '~/types';
import { authOptions } from '~/pages/api/auth/[...nextauth]';

// TODO: project page (Projects page from before)
const ProjectPage: AppPage<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ }) => {
  // TODO: error page if no project with provided ID exists
  // TODO: error page if they can't access this project

  const pageTitle = '[INSERT PROJECT NAME HERE] - Make-It-All';

  return (
    <main>
      <Head>
        <title>{pageTitle}</title>
      </Head>
    </main>
  );
};

ProjectPage.layout = {
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

  const { id } = context.params!;
  const decodedId = hashids.decode(id as string);

  const projectId = decodedId[0] as number | undefined;

  // TODO: use prisma to get info about project from database

  return {
    props: {
      session,
      user,
    },
  };
}

export default ProjectPage;
