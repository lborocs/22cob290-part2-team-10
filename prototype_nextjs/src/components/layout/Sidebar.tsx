import Link from 'next/link';
import Image from 'next/image';

import styles from '~/styles/layout/Sidebar.module.css';
import makeItAllLogo from '~/../public/company-logo.png';

export type SidebarProps = {
  show: boolean
  content: React.ReactNode
};

// TODO: maintain showing sidebar state across pages
// but idt that's possible without using Layout in _app

export default function Sidebar({ show, content }: SidebarProps) {
  return (
    <aside className={`${styles.sidebar} ${show ? '' : styles.hidden}`} >
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
        {content}
      </div>
    </aside>
  );
}
