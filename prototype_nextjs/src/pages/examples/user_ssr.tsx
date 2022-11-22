import type { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import { unstable_getServerSession } from 'next-auth/next';

import { authOptions } from '~/pages/api/auth/[...nextauth]';
import { getUserInfo } from '~/server/store/users';

export default function ExamplePage({
  user,
  /* the rest of your props */
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  if (!user) return null;

  return (
    <>
      <h1>Email: {user.email}</h1>
      <span>Name: {user.name}</span>
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await unstable_getServerSession(context.req, context.res, authOptions);

  // not logged in, will be handled by _app
  if (!session || !session.user) {
    return { props: {} };
  }

  const email = session.user.email!; // e.g. alice@make-it-all.co.uk
  const user = (await getUserInfo(email))!;

  /* get whatever data you want to pass to component as a prop */

  return {
    props: {
      session,
      user, // NEED to return user for layout
      // pass props here
    },
  };
}