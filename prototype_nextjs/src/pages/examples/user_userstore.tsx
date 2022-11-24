import type { GetServerSidePropsContext } from 'next';
import { unstable_getServerSession } from 'next-auth/next';
import { useStore } from 'zustand';

import { useUserStore } from '~/store/userStore';
import { authOptions } from '~/pages/api/auth/[...nextauth]';
import { ssrGetUserInfo } from '~/server/utils';

export default function ExamplePage() {
  const userStore = useUserStore();
  const email = useStore(userStore, (state) => state.user.email);
  const name = useStore(userStore, (state) => state.user.name);

  return (
    <main>
      <div className="h2 mb-4">Using <code>userStore</code></div>
      <h1>Email: {email}</h1>
      <span>Name: {name}</span>
    </main>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await unstable_getServerSession(context.req, context.res, authOptions);

  // not logged in, will be handled by _app
  if (!session || !session.user) {
    return { props: {} };
  }

  const user = await ssrGetUserInfo(session);

  /* get whatever data you want to pass to component as a prop */

  return {
    props: {
      session,
      user, // NEED to return user for `userStore`
      // pass props here
    },
  };
}

