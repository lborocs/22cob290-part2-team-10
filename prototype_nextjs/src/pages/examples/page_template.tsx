import type { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import Head from 'next/head';
import { unstable_getServerSession } from 'next-auth/next';

import Layout from '~/components/Layout';
import { authOptions } from '~/pages/api/auth/[...nextauth]';
import { getUserInfo } from '~/server/store/users';

export default function Page({ user }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  if (!user) return null;

  return (
    <>
      <Head>
        <title>Page Template - Make-It-All</title>
      </Head>
      <Layout user={user} sidebarType="projects">
        <main>
          <h1>Page template</h1>
          <span>~ok~</span>
          <button>Example Button</button>
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

  const email = session.user.email!;
  const user = (await getUserInfo(email))!;

  return {
    props: {
      session,
      user,
    },
  };
}
