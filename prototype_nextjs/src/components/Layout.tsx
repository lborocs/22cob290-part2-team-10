import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import { faAlignJustify, faAlignLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Sidebar from '~/components/layout/Sidebar';
import ProjectsList from '~/components/layout/sidebar/ProjectsList';

import styles from '~/styles/Layout.module.css';
import LayoutNav from './layout/LayoutNav';

// gives flexibility to have more shared sidebars (not just projects)
export enum SidebarType {
  CUSTOM = 'custom',
  PROJECTS = 'projects',
}

export type LayoutProps = {
  sidebarType: SidebarType
  sidebarContent?: React.ReactNode
  children: React.ReactNode
};

export default function Layout({
  sidebarType,
  sidebarContent,
  children,
}: LayoutProps) {
  const [showSidebar, setShowSidebar] = useState(true);

  const getSidebarContent = (): React.ReactNode => {
    switch (sidebarType) {
      case SidebarType.CUSTOM:
        return sidebarContent;

      case SidebarType.PROJECTS:
        return <ProjectsList />;

      default:
        return (
          <>
            <strong>Invalid sidebar type</strong>
            {sidebarContent}
          </>
        );
    }
  };

  return (
    <div className={styles.wrapper}>
      <Sidebar
        show={showSidebar}
        content={getSidebarContent()}
      />

      <div className={styles.content}>
        <header>
          <Navbar expand="lg" className={styles.navbar}>
            <Container fluid>
              <Button
                onClick={() => setShowSidebar((show) => !show)}
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
