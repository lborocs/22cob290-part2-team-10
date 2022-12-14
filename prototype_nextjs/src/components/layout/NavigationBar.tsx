import Button from 'react-bootstrap/Button';
import Navbar from 'react-bootstrap/Navbar';
import { faAlignJustify, faAlignLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import LayoutNav from '~/components/layout/LayoutNav';
import ThemeSwitcher from '~/components/layout/ThemeSwitcher';

import styles from '~/styles/Layout.module.css';

// left, center, right: https://stackoverflow.com/a/20362024
export default function NavigationBar({ noSidebar, toggleSidebar, title }: {
  noSidebar: boolean
  toggleSidebar: () => void
  title: React.ReactNode
}) {
  const toggleSidebarButton = !noSidebar && (
    <Button
      onClick={toggleSidebar}
      className={styles.sidebarToggleBtn}
    >
      <FontAwesomeIcon icon={faAlignLeft} />
      {' '}
      <span className="d-none d-lg-inline">Toggle Sidebar</span>
    </Button>
  );

  return (
    <Navbar expand="lg" className={styles.navbar}>
      {/* desktop left */}
      <div className="w-100 order-1 order-md-0 d-none d-lg-inline">
        {/* <div className="d-none d-lg-inline">
        </div> */}
        {toggleSidebarButton}
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
          <ThemeSwitcher />
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
      <div className="w-100 order-2">
        <Navbar.Collapse id="nav">
          <div className="ms-auto">
            <LayoutNav />
          </div>
        </Navbar.Collapse>
      </div>
    </Navbar>
  );
}
