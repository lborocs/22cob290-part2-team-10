import Link from 'next/link';
import { useRouter } from 'next/router';
import Nav from 'react-bootstrap/Nav';

import TextAvatar from '~/components/TextAvatar';

// TODO: dashboard might depend on it user role is company-wide project manager

export default function LayoutNav() {
  const router = useRouter();
  const route = router.pathname;

  return (
    <Nav
      activeKey={route}
      className="align-items-lg-center"
    >
      <Link href="/home" passHref legacyBehavior>
        <Nav.Link>Home</Nav.Link>
      </Link>
      <Link href="/forum" passHref legacyBehavior>
        <Nav.Link>Forum</Nav.Link>
      </Link>
      <Link href="/projects" passHref legacyBehavior>
        <Nav.Link>Projects</Nav.Link>
      </Link>
      {/* {(role === Role.MANAGER || role === Role.TEAM_LEADER) && (
        <Link href="/dashboard" passHref legacyBehavior>
          <Nav.Link>Dashboard</Nav.Link>
        </Link>
      )} */}
      <Link href="/dashboard" passHref legacyBehavior>
        <Nav.Link>Dashboard</Nav.Link>
      </Link>
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

