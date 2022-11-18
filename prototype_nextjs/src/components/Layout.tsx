import { ReactNode } from 'react';
// import { useRouter } from 'next/router';
import Link from 'next/link';

export async function getServerSideProps(context: any) {
  return {
    props: {}, // will be passed to the page component as props
  };
}

export default function Layout({ children }: { children: ReactNode }) {
  // const router = useRouter();

  return (
    <>
      <header>
        <nav>
          <Link href="home" className="">Home</Link>
          <Link href="Forum" className="">Forum</Link>
          <Link href="Projects" className="">Projects</Link>
        </nav>
      </header>
      <div>

        <main>
          {children}
        </main>
      </div>
    </>
  );
}
