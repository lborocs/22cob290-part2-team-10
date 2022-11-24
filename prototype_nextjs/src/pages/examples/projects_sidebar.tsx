import type { GetServerSidePropsContext } from 'next';
import { unstable_getServerSession } from 'next-auth/next';

import Layout from '~/components/Layout';
import { authOptions } from '~/pages/api/auth/[...nextauth]';
import { ssrGetUserInfo } from '~/server/utils';

export default function ExamplePage() {
  return (
    <Layout sidebarType="projects">
      <main>
        <h1>Assigned projects sidebar example</h1>
      </main>
    </Layout>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await unstable_getServerSession(context.req, context.res, authOptions);

  if (!session || !session.user) {
    return { props: {} };
  }

  const user = await ssrGetUserInfo(session);

  return {
    props: {
      session,
      user,
    },
  };
}
