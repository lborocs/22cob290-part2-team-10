import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import { faAlignJustify, faAlignLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import LayoutNav from '~/components/layout/LayoutNav';
import Sidebar from '~/components/layout/Sidebar';
import ProjectsList from '~/components/layout/sidebar/ProjectsList';

import styles from '~/styles/Layout.module.css';

// gives flexibility to have more shared sidebars (not just projects)
export enum SidebarType {
  NONE = 'none',
  CUSTOM = 'custom',
  PROJECTS = 'projects',
}

type BaseSidebar = {
  type: SidebarType
  content?: React.ReactNode
};

interface CustomSidebar extends BaseSidebar {
  type: SidebarType.CUSTOM
  content: React.ReactNode
}

interface DefaultSidebar extends BaseSidebar {
  type: Exclude<SidebarType, SidebarType.CUSTOM>
  content?: undefined
}

type Sidebar = CustomSidebar | DefaultSidebar;

export type PageLayout = {
  title?: string
  sidebar: Sidebar
};

export interface LayoutProps extends PageLayout {
  children: React.ReactNode
}

// TODO: center brand horizontally
export default function Layout({
  title,
  sidebar,
  children,
}: LayoutProps) {
  const noSidebar = sidebar.type === SidebarType.NONE;
  const [showSidebar, setShowSidebar] = useState(true && !noSidebar);

  const getSidebarContent = (): React.ReactNode => {
    switch (sidebar.type) {
      case SidebarType.CUSTOM:
        return sidebar.content;

      case SidebarType.PROJECTS:
        return <ProjectsList />;

      default:
        return (
          <>
            <strong>Invalid sidebar type</strong>
            {sidebar.content}
          </>
        );
    }
  };

  return (
    <div className={styles.wrapper}>
      {!noSidebar && (
        <Sidebar
          show={showSidebar}
          content={getSidebarContent()}
        />
      )}

      <div className={styles.content}>
        <header>
          <Navbar expand="lg" className={styles.navbar}>
            <Container fluid>
              <div>
                {!noSidebar && (
                  <Button
                    onClick={() => setShowSidebar((show) => !show)}
                    className={styles['sidebar-toggle-btn']}
                  >
                    <FontAwesomeIcon icon={faAlignLeft} />
                    {' '}
                    <span className="d-none d-md-inline">Toggle Sidebar</span>
                  </Button>
                )}
              </div>

              <Navbar.Brand>
                {title}
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
                <LayoutNav />
              </Navbar.Collapse>
            </Container>
          </Navbar>
        </header>

        {children}
      </div>
    </div>
  );
}
