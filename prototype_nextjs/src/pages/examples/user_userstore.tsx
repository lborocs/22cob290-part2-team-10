import type { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import { unstable_getServerSession } from 'next-auth/next';

import useUserStore from '~/store/userStore';
import type { SessionUser } from '~/types';
import { authOptions } from '~/pages/api/auth/[...nextauth]';

export default function ExamplePage() {
  const [email, name] = useUserStore(
    ({ user }) => [user.email, user.name]
  );

  return (
    <main>
      <Head>
        <title>User Store - Examples</title>
      </Head>
      <div className="h2 mb-4">Using <code>useUserStore</code></div>
      <h1>Email: {email}</h1>
      <span>Name: {name}</span>
    </main>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await unstable_getServerSession(context.req, context.res, authOptions);

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
