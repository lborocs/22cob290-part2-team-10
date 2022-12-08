import Link from 'next/link';

// TODO: ForumSidebar
export default function ForumSidebar() {

  return (
    <div className="d-flex flex-column">
      <Link href="/forum/authors">
        <p>Authors</p>
      </Link>
      (This is the Forum sidebar)
    </div>
  );
}
