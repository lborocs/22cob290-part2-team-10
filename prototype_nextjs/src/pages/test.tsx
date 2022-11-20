import Link from 'next/link';
import { useSession } from 'next-auth/react';

export default function TestPage() {
  const { data: session, status } = useSession();

  // console.log(session);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (status === 'authenticated') {
    return (
      <>
        <Link href="/">Login</Link>
        <Link href="/signup">Signup</Link>
        <Link href="/profile">Profile</Link>
        <h1>Logged in...</h1>
        {JSON.stringify(session)}
      </>
    );
  }

  return (
    <>
      <h1>Not logged in!</h1>
    </>
  );
}
