import { useState } from 'react';
import Button from 'react-bootstrap/Button';
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
  title?: React.ReactNode
  sidebar: Sidebar
};

export interface LayoutProps extends PageLayout {
  children: React.ReactNode
}

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
          <NavigationBar
            noSidebar={noSidebar}
            setShowSidebar={setShowSidebar}
            title={title}
          />
        </header>
        {children}
      </div>
    </div>
  );
}

const NavigationBar = ({ noSidebar, setShowSidebar, title }: {
  noSidebar: boolean
  setShowSidebar: React.Dispatch<React.SetStateAction<boolean>>
  title: React.ReactNode
}) => {
  const toggleSidebarButton = !noSidebar && (
    <Button
      onClick={() => setShowSidebar((show) => !show)}
      className={styles['sidebar-toggle-btn']}
    >
      <FontAwesomeIcon icon={faAlignLeft} />
      {' '}
      <span className="d-none d-lg-inline">Toggle Sidebar</span>
    </Button>
  );

  return (
    <Navbar expand="lg" className={styles.navbar}>
      {/* desktop left */}
      <div className="w-100 order-1 order-md-0">
        <div className="d-none d-lg-inline">
          {toggleSidebarButton}
        </div>
      </div>
      {/* desktop middle */}
      <div className="mx-auto w-100 order-1 d-flex">
        {/* mobile left */}
        <div className="d-inline-block d-lg-none">
          {toggleSidebarButton}
        </div>
        {/* middle */}
        <div className="mx-auto">
          {title}
        </div>
        {/* mobile right */}
        <div className="d-inline-block d-lg-none">
          <Navbar.Toggle
            aria-controls="nav"
            as={Button}
            variant="dark"
            bsPrefix="_" // hacky way to not have default toggle style. Can't use undefined so using _
          >
            <FontAwesomeIcon icon={faAlignJustify} />
          </Navbar.Toggle>
        </div>
      </div>
      {/* desktop right */}
      <Navbar.Collapse id="nav" className="w-100 order-2">
        <div className="ms-auto">
          <LayoutNav />
        </div>
      </Navbar.Collapse>
    </Navbar>
  );
};
