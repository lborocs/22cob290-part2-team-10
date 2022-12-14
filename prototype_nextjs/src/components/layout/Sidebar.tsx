import Link from 'next/link';
import Image from 'next/image';

import styles from '~/styles/layout/Sidebar.module.css';
import makeItAllLogo from '~/../public/company-logo.png';

export type SidebarProps = {
  show: boolean
  content: React.ReactNode
};

export default function Sidebar({ show, content }: SidebarProps) {
  return (
    <aside className={`${styles.sidebar} ${show ? '' : styles.hidden}`} >
      <div className={styles.sidebarHeader}>
        <Link href="/home">
          <Image
            src={makeItAllLogo}
            alt="Company logo"
            className={styles.companyLogo}
            priority
          />
        </Link>
      </div>

      <div className={styles.sidebarContent}>
        {content}
      </div>
    </aside>
  );
}
