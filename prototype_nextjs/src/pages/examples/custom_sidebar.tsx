import type { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import { unstable_getServerSession } from 'next-auth/next';
import Typography from '@mui/material/Typography';
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

      <Typography variant="h4" component="h1">
        Custom sidebar example
      </Typography>

      <Typography component="span" marginRight={1}>
        Enter a name:
      </Typography>
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
      <Typography variant="h5" component="h1">
        Prem Table
      </Typography>
      <ol>
        <li>Arsenal</li>
        <li>Man City</li>
        <li>???</li>
        <li>{'Doesn\'t Matter'}</li>
        <li>{'Don\'t care'}</li>
      </ol>

      <Typography>
        name = {name}
      </Typography>
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
