import type { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import Head from 'next/head';
import { unstable_getServerSession } from 'next-auth/next';

import Layout from '~/components/Layout';
import { authOptions } from '~/pages/api/auth/[...nextauth]';
import { ssrGetUserInfo } from '~/server/utils';

// TODO: SignupPage
export default function SignupPage({ user, token }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  if (!user) return null;

  return (
    <>
      <Head>
        <title>Signup - Make-It-All</title>
      </Head>
      <Layout user={user} sidebarType="projects">
        <main>
          {/* TODO */}
          token = {token}
        </main>
      </Layout>
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await unstable_getServerSession(context.req, context.res, authOptions);

  if (!session || !session.user) {
    return { props: {} };
  }

  const user = await ssrGetUserInfo(session);

  // should we verify token during SSR?
  const token = context.query?.token as string | undefined ?? null;

  return {
    props: {
      session,
      user,
      token,
    },
  };
}
