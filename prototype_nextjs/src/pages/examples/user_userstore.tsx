import type { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import { unstable_getServerSession } from 'next-auth/next';
import Typography from '@mui/material/Typography';

import useUserStore from '~/store/userStore';
import type { AppPage, SessionUser } from '~/types';
import { authOptions } from '~/pages/api/auth/[...nextauth]';

const ExamplePage: AppPage = () => {
  const { setName, email, name } = useUserStore((state) => ({
    setName: state.setName,
    email: state.user.email,
    name: state.user.name,
  }));

  const changeName = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newName = new FormData(e.currentTarget).get('name') as string;

    setName(newName);
  };

  return (
    <main>
      <Head>
        <title>User Store - Examples</title>
      </Head>

      <Typography variant="h4" marginBottom={2} component="h1">
        Using{' '}
        <code
          style={{
            color: 'crimson',
            backgroundColor: '#f1f1f1',
          }}
        >
          useUserStore
        </code>{' '}
        prop
      </Typography>

      <Typography variant="h5" component="p">
        Email: {email}
      </Typography>
      <Typography>Name: {name}</Typography>

      <div>
        <form onSubmit={changeName}>
          <Typography marginRight={1} component="label" htmlFor="new-name">
            New name:
          </Typography>
          <input id="new-name" defaultValue={name} name="name" />
          <button type="submit">Change (only on client)</button>
        </form>
      </div>
    </main>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );

  // not signed in, will be handled by _app
  // return `notFound: true` as a hacky way to have non-null page props for typescript
  if (!session || !session.user) {
    return { notFound: true };
  }

  const user = session.user as SessionUser;

  /* get whatever data you want to pass to component as a prop */

  return {
    props: {
      session,
      user, // NEED to return user for `userStore`
      // pass props here
    },
  };
}

export default ExamplePage;
