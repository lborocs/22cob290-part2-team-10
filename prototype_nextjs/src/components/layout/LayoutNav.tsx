import Link from 'next/link';
import { useRouter } from 'next/router';
import Nav from 'react-bootstrap/Nav';

import useUserStore from '~/store/userStore';
import TextAvatar from '~/components/TextAvatar';
import ThemeSwitcher from '~/components/layout/ThemeSwitcher';

export default function LayoutNav() {
  const router = useRouter();
  const isManager = useUserStore((state) => state.user.isManager);

  return (
    <Nav
      activeKey={router.pathname}
      className="align-items-lg-center"
    >
      <span className="d-none d-lg-inline">
        <ThemeSwitcher />
      </span>
      <Link href="/home" passHref legacyBehavior>
        <Nav.Link>Home</Nav.Link>
      </Link>
      <Link href="/forum" passHref legacyBehavior>
        <Nav.Link>Forum</Nav.Link>
      </Link>
      <Link href="/projects" passHref legacyBehavior>
        <Nav.Link>Projects</Nav.Link>
      </Link>
      <Link href="/dashboard" passHref legacyBehavior>
        <Nav.Link>Dashboard</Nav.Link>
      </Link>
      {isManager && (
        <Link href="/staff_assignment" passHref legacyBehavior>
          <Nav.Link>Staff</Nav.Link>
        </Link>
      )}
      <Link href="/profile" passHref legacyBehavior>
        <Nav.Link><Profile /></Nav.Link>
      </Link>
    </Nav>
  );
}

function Profile() {
  return (
    <>
      <span className="d-lg-none">Profile</span>
      <span className="d-none d-lg-inline">
        <TextAvatar />
      </span>
    </>
  );
}

