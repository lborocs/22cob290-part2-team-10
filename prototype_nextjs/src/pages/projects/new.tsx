import type { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import Head from 'next/head';
import { unstable_getServerSession } from 'next-auth/next';

import Layout from '~/components/Layout';
import { authOptions } from '~/pages/api/auth/[...nextauth]';
import { ssrGetUserInfo } from '~/server/utils';

// TODO: NewProjectPage
export default function NewProjectPage({ }: InferGetServerSidePropsType<typeof getServerSideProps>) {

  return (
    <>
      <Head>
        <title>New Project - Make-It-All</title>
      </Head>
      <Layout sidebarType="projects">
        <main>
          {/* TODO */}
        </main>
      </Layout>
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await unstable_getServerSession(context.req, context.res, authOptions);

  if (!session || !session.user) {
    return { notFound: true };
  }

  const user = await ssrGetUserInfo(session);

  return {
    props: {
      session,
      user,
    },
  };
}
