import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from 'next';
import Head from 'next/head';
import { unstable_getServerSession } from 'next-auth/next';

import hashids from '~/lib/hashids';
import prisma from '~/lib/prisma';
import ErrorPage from '~/components/ErrorPage';
import { SidebarType } from '~/components/Layout';
import type { AppPage, SessionUser } from '~/types';
import { authOptions } from '~/pages/api/auth/[...nextauth]';

// TODO: project page (Projects page from before)
const ProjectPage: AppPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ project }) => {
  if (!project) {
    return <ErrorPage statusCode={404} title="Project not found" />;
  }

  const pageTitle = `${project.name} - Make-It-All`;

  return (
    <main>
      <Head>
        <title>{pageTitle}</title>
      </Head>

      <body>
        <h1>{project.name}</h1>
      </body>
    </main>
  );
};

ProjectPage.layout = {
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

  const { id } = context.params!;
  const decodedId = hashids.decode(id as string);
  console.log(decodedId);
  const projectId = decodedId[0] as number | undefined;
  console.log(projectId);
  console.log('id =', id);
  if (!projectId) {
    return { notFound: true };
  }

  // TODO: use prisma to get info about project from database
  const project = await prisma.project.findUnique({
    where: {
      id: projectId, // provide the required `id` argument here
    },
  });

  if (!project) {
    return { notFound: true };
  }

  return {
    props: {
      session,
      user,
      project,
    },
  };
}

export default ProjectPage;
