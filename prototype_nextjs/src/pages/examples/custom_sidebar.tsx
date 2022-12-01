import type { GetServerSidePropsContext } from 'next';
import { unstable_getServerSession } from 'next-auth/next';

import { SidebarType } from '~/components/Layout';
import { authOptions } from '~/pages/api/auth/[...nextauth]';
import { ssrGetUserInfo } from '~/server/utils';

export default function ExamplePage() {
  return (
    <main>
      <h1>Custom sidebar example</h1>
    </main>
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

ExamplePage.sidebarType = SidebarType.CUSTOM;

ExamplePage.sidebarContent = Sidebar;
// ExamplePage.sidebarContent = <Sidebar />;
