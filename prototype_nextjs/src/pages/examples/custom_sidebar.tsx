import type { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import { unstable_getServerSession } from 'next-auth/next';

import Layout from '~/components/Layout';
import { authOptions } from '~/pages/api/auth/[...nextauth]';
import { getUserInfo } from '~/server/store/users';

export default function ExamplePage({ user }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  if (!user) return null;

  return (
    <Layout user={user} sidebarType='custom' sidebarContent={<Sidebar />}>
      <main>
        <h1>Custom sidebar example</h1>
      </main>
    </Layout>
  );
}

function Sidebar() {
  return (
    <div>
      <span className="h3">Prem Table</span>
      <ol>
        <li>Arsenal</li>
        <li>Man City</li>
        <li>???</li>
        <li>{'Doesn\'t Matter'}</li>
        <li>{'Don\'t care'}</li>
      </ol>
    </div>
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
