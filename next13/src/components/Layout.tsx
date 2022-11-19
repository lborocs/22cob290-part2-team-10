import { ReactNode } from 'react';
// import { useRouter } from 'next/router';
import Link from 'next/link';

// TODO
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
          <Link href="forum" className="">Forum</Link>
          <Link href="projects" className="">Projects</Link>
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
