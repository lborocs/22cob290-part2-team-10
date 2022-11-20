import type { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import { unstable_getServerSession } from 'next-auth/next';
// import { useSession } from 'next-auth/react';
import { signOut } from 'next-auth/react';
import Button from 'react-bootstrap/Button';

import { authOptions } from '~/pages/api/auth/[...nextauth]';
import { getUser } from '~/pages/api/user/getUser';

export default function ProfilePage({ user }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  if (!user) return null;

  const { email, role } = user;

  return (
    <main>
      <div>
        Email: {email}
      </div>
      <div>
        Role: {role}
      </div>

      <Button variant='danger' onClick={() => signOut({ callbackUrl: '/' })}>
        Sign Out
      </Button>
    </main>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await unstable_getServerSession(context.req, context.res, authOptions);

  // use auth's redirection because it gives callback URL
  if (!session) {
    console.log('PROFILE SSR NO SESSION');
    return {
      props: {
      },
      // redirect: {
      //   destination: '/',
      //   permanent: false,
      // },
    };
  }

  const email = session.user!.email!;
  const user = getUser(email)!;

  return {
    props: {
      session,
      user,
    },
  };
}

ProfilePage.auth = true;
