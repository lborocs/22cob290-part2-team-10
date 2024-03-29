import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from 'next';
import Head from 'next/head';
import { getServerSession } from 'next-auth/next';
import Typography from '@mui/material/Typography';

import type { AppPage, SessionUser } from '~/types';
import { authOptions } from '~/pages/api/auth/[...nextauth]';

const ExamplePage: AppPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({
  user,
  /* the rest of your props */
}) => {
  const { email, name } = user;

  return (
    <main>
      <Head>
        <title>User SSR - Examples</title>
      </Head>
      <Typography variant="h4" marginBottom={2} component="h1">
        Using{' '}
        <code
          style={{
            color: 'crimson',
            backgroundColor: '#f1f1f1',
          }}
        >
          user
        </code>{' '}
        prop
      </Typography>
      <Typography variant="h5">Email: {email}</Typography>
      <Typography>Name: {name}</Typography>
    </main>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);

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
      user, // NEED to return user for layout
      // pass props here
    },
  };
}

export default ExamplePage;
