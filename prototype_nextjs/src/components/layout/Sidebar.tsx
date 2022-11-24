import Link from 'next/link';
import Image from 'next/image';

import styles from '~/styles/layout/Sidebar.module.css';
import makeItAllLogo from '~/../public/company-logo.png';

export default function Sidebar({ show, content }: {
  show: boolean
  content: React.ReactNode
}) {
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
