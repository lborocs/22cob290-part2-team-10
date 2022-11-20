import Link from 'next/link';

export default function HomePage() {
  return (
    <>
      <Link href="/">Login</Link>
      <Link href="/signup">Signup</Link>
      <Link href="/profile">Profile</Link>
    </>
  );
}
