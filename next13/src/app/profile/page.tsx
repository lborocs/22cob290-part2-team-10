import { unstable_getServerSession } from 'next-auth/next';
// import { useSession } from 'next-auth/react';
import { signOut } from 'next-auth/react';
import Button from 'react-bootstrap/Button';

import { getUser } from '~/pages/api/user/getUser';

// app/page.js
async function getData() {
  const res = await fetch('https://api.example.com/...');
  // The return value is *not* serialized
  // You can return Date, Map, Set, etc.
  return res.json();
}

export default async function ProfilePage() {
  const session = (await unstable_getServerSession());

  if (!session || !session.user) {
    return (
      <h1>Not logged in.</h1>
    );
  }

  const email = session.user.email!;
  const user = getUser(email)!;

  if (!user) return null;

  const { role } = user;

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
