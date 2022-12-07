import type { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import { unstable_getServerSession } from 'next-auth/next';
import create from 'zustand';

import { SidebarType } from '~/components/Layout';
import type { AppPage, SessionUser } from '~/types';
import { authOptions } from '~/pages/api/auth/[...nextauth]';

type Store = {
  name: string
  setName: (name: string) => void
};

const useStore = create<Store>((set) => ({
  name: 'Bob',
  setName: (name) => set((state) => ({ name })),
}));

const ExamplePage: AppPage = () => {
  const { name, setName } = useStore();

  return (
    <main>
      <Head>
        <title>Custom Sidebar - Examples</title>
      </Head>

      <h1>Custom sidebar example</h1>
      Enter a name:
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
    </main>
  );
};

function Sidebar() {
  const name = useStore((state) => state.name);

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

      <div className="mt-4">
        name = {name}
      </div>
    </div>
  );
}

ExamplePage.layout = {
  sidebar: {
    type: SidebarType.CUSTOM,
    content: <Sidebar />,
  },
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await unstable_getServerSession(context.req, context.res, authOptions);

  if (!session || !session.user) {
    return { notFound: true };
  }

  const user = session.user as SessionUser;

  return {
    props: {
      session,
      user,
    },
  };
}

export default ExamplePage;
