import Link from 'next/link';
import { unstable_getServerSession } from 'next-auth/next';
import { authOptions } from './api/auth/[...nextauth]';
import { useSession } from 'next-auth/react';

export default function TestPage() {
  const { data: session } = useSession();

  return (
    <>
      <Link href="/">Login</Link>
      <Link href="/signup">Signup</Link>
      <Link href="/profile">Profile</Link>
      <h1>Logged in...</h1>
    </>
  );
}

export async function getServerSideProps(context: any) {
  return {
    props: {
      session: await unstable_getServerSession(
        context.req,
        context.res,
        authOptions,
      ),
    },
  };
}

TestPage.auth = true;
