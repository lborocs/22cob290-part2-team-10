import type { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import { unstable_getServerSession } from 'next-auth/next';

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
      <div className="h2 mb-4">Using <code>useUserStore</code></div>
      <h1>Email: {email}</h1>
      <p>Name: {name}</p>

      <div>
        <form onSubmit={changeName}>
          <label htmlFor="new-name">New name:</label>
          <input id="new-name" defaultValue={name} name="name" />
          <button type="submit" >Change (only on client)</button>
        </form>
      </div>
    </main>
  );
};

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

export default ExamplePage;
