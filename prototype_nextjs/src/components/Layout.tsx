import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAlignJustify, faAlignLeft } from '@fortawesome/free-solid-svg-icons';

import ProjectsList from '~/components/sidebar/ProjectsList';
import TextAvatar from '~/components/TextAvatar';
import { Role } from '~/types';
import type { UserInfo } from '~/server/store/users';

import styles from '~/styles/Layout.module.css';
import makeItAllLogo from '~/../public/company-logo.png';

// gives flexibility to have more shared sidebars (not just projects)
type SidebarType = 'projects' | 'custom';

type DefaultSidebar = {
  sidebarType: Exclude<SidebarType, 'custom'>
  sidebarContent?: undefined
};

type CustomSidebar = {
  sidebarType: 'custom'
  sidebarContent: React.ReactNode
};

type LayoutProps = (DefaultSidebar | CustomSidebar) & {
  user: UserInfo
  children: React.ReactNode
};

export default function Layout({
  sidebarType,
  sidebarContent,
  user,
  children,
}: LayoutProps) {
  const router = useRouter();

  const [hideSidebar, setHideSidebar] = useState(false);

  const getSidebarContent = (): React.ReactNode => {
    switch (sidebarType) {
      case 'custom':
        return sidebarContent;
      default:
        return <ProjectsList />;
    }
  };

  const route = router.pathname;

  return (
    <div className={styles.wrapper}>
      {/* sidebar */}
      <aside className={`${styles.sidebar} ${hideSidebar ? styles.hidden : ''}`} >
        <div className={styles['sidebar-header']}>
          <Link href="/home">
            <Image
              src={makeItAllLogo}
              alt="Company logo"
              className={styles['company-logo']}
              priority
            />
          </Link>
        </div>

        <div className={styles['sidebar-content']}>
          {getSidebarContent()}
        </div>
      </aside>

      <div className={styles.content}>
        <header>
          <Navbar expand="lg" className={styles.navbar}>
            <Container fluid>
              <Button
                onClick={() => setHideSidebar((hide) => !hide)}
                className={styles['sidebar-toggle-btn']}
              >
                <FontAwesomeIcon icon={faAlignLeft} />
                {' '}
                <span className="d-none d-md-inline">Toggle Sidebar</span>
              </Button>

              <Navbar.Brand>
                {/*
                  TODO: get rid of brand/have prop that is something like pageTitle
                  TODO: center brand horizontally
                */}
              </Navbar.Brand>

              <Navbar.Toggle
                aria-controls="nav"
                as={Button}
                variant="dark"
                className="d-lg-none"
                bsPrefix="_" // hacky way to not have default toggle style
              >
                <FontAwesomeIcon icon={faAlignJustify} />
              </Navbar.Toggle>

              <Navbar.Collapse id="nav" className="justify-content-end">
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
                  {user.role === Role.MANAGER && (
                    <Link href="/dashboard" passHref legacyBehavior>
                      <Nav.Link>Dashboard</Nav.Link>
                    </Link>
                  )}
                  <Link href="/profile" passHref legacyBehavior>
                    <Nav.Link><Profile user={user} /></Nav.Link>
                  </Link>
                </Nav>
              </Navbar.Collapse>

            </Container>
          </Navbar>
        </header>

        {children}
      </div>
    </div>
  );
}

function Profile({ user }: { user: UserInfo }) {
  return (
    <>
      <span className="d-lg-none">Profile</span>
      <span className="d-none d-lg-inline">
        <TextAvatar user={user} />
      </span>
    </>
  );
}
