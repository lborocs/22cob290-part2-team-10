import Link from 'next/link';
import Image from 'next/image';
// import { useRouter } from 'next/router';

import ProjectsList from '~/components/sidebar/ProjectsList';
import type { UserInfo } from '~/server/store/users';

import styles from '~/styles/Layout.module.css';
import makeItAllLogo from '~/../public/company-logo.png';
import { Role } from '~/types';

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
  // const router = useRouter();

  // TODO: set active navItem using router.pathname(?)

  const getSidebarContent = (): React.ReactNode => {
    switch (sidebarType) {
      case 'custom':
        return sidebarContent;
      default:
        return <ProjectsList />;
    }
  };

  return (
    <>
      {/* sidebar */}
      <div className={styles.sidebar}>
        <div className={styles['sidebar-header']}>
          <Link href="/home">
            <Image
              src={makeItAllLogo}
              alt="Company Logo"
              priority
            />
          </Link>
        </div>

        <nav className={`${styles.components}`}>
          {getSidebarContent()}
        </nav>
      </div>

      <div>
        <header>
          <nav>
            {/* navbar */}
            <Link href="/home">Home</Link>
            <Link href="/forum">Forum</Link>
            <Link href="/projects">Projects</Link>
            {user.role === Role.MANAGER && (
              <Link href="/dashboard">Dashboard</Link>
            )}
            {/* TODO: text avatar (maybe make it its own component) */}
            <Link href="/profile">Profile</Link>
          </nav>
        </header>

        {children}
      </div>
    </>
  );
}
