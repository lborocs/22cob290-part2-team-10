import type { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import Head from 'next/head';
import { unstable_getServerSession } from 'next-auth/next';

import Layout from '~/components/Layout';
import SignUpSchema from '~/schemas/user/signup'; // TODO: use
import { authOptions } from '~/pages/api/auth/[...nextauth]';

// TODO: SignupPage
export default function SignupPage({ token }: InferGetServerSidePropsType<typeof getServerSideProps>) {

  return (
    <>
      <Head>
        <title>Signup - Make-It-All</title>
      </Head>
      <Layout sidebarType="projects">
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

  // if logged in, redirect to home page
  if (session && session.user) {
    return {
      redirect: {
        destination: '/home',
        permanent: false,
      },
    };
  }

  // should we verify token during SSR?
  const token = context.query?.invite as string | undefined ?? null;

  return {
    props: {
      token,
    },
  };
}

SignupPage.noauth = true;
