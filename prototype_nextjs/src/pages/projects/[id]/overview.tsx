import type { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import Head from 'next/head';
import { unstable_getServerSession } from 'next-auth/next';

import hashids from '~/lib/hashids';
import prisma from '~/lib/prisma';
import { getUserRoleInProject } from '~/lib/projects';
import ErrorPage from '~/components/ErrorPage';
import { SidebarType, type PageLayout } from '~/components/Layout';
import { authOptions } from '~/pages/api/auth/[...nextauth]';
import { type SessionUser, ProjectRole } from '~/types';

// TODO: ProjectOverviewPage
export default function ProjectOverviewPage({ project, role }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  if (!project) return (
    <ErrorPage
      title="Project does not exist."
      buttonContent="Home"
      buttonUrl="/home"
    />
  );

  // only managers can see the project overview
  if (role !== ProjectRole.MANAGER) return (
    <ErrorPage
      title="You do not have access to this page."
      buttonContent="Projects"
      buttonUrl="/projects"
    />
  );

  const {
    name,
    manager,
    leader,
    members,
  } = project;

  const pageTitle = `Overview ${name} - Make-It-All`;

  return (
    <main>
      <Head>
        <title>{pageTitle}</title>
      </Head>
      <main>
        <h1>{name}</h1>
        <div className="d-flex flex-column">
          <p>Manager: {manager.name}</p>
          <p>Leader: {leader.name}</p>
          <section>
            <p>Members:</p>
            {members.map(({ member }, index) => (
              <p key={index}>{member.id}</p>
            ))}
          </section>
        </div>
      </main>
    </main>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await unstable_getServerSession(context.req, context.res, authOptions);

  if (!session || !session.user) {
    return { notFound: true };
  }

  const user = session.user as SessionUser;

  const { id } = context.params!;
  const decodedId = hashids.decode(id as string);

  const projectId = decodedId[0] as number | undefined;

  const project = await prisma.project.findUnique({
    where: {
      id: projectId,
    },
    include: {
      manager: {
        select: {
          id: true,
          name: true,
        },
      },
      leader: {
        select: {
          id: true,
          name: true,
        },
      },
      members: {
        select: {
          memberId: true,
          member: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  });

  if (!project) return {
    props: {
      session,
      user,
      project: null,
    },
  };

  const role = getUserRoleInProject(user.id, project);

  return {
    props: {
      session,
      user,
      project,
      role,
    },
  };
}

const layout: PageLayout = {
  sidebar: {
    type: SidebarType.PROJECTS,
  },
};
ProjectOverviewPage.layout = layout;
