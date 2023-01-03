import Link from 'next/link';
import Image from 'next/image';
import Box from '@mui/material/Box';

import styles from '~/styles/layout/Sidebar.module.css';
import makeItAllLogo from '~/../public/assets/company-logo.png';

export type SidebarProps = {
  show: boolean
  content: React.ReactNode
};

// TODO?: make sidebar sticky? (have its scroll separate to the page)
// TODO: make act like Drawer on mobile
export default function Sidebar({ show, content }: SidebarProps) {
  return (
    <Box
      className={`${styles.sidebar} ${show ? '' : styles.hidden}`}
      bgcolor="makeItAllGrey.main"
      color="black"
      component="aside"
      // override app theme for sidebar - at least until configured sidebar colours in dark mode
      data-mui-color-scheme="light"
    >
      <div className={styles.sidebarHeader}>
        <Link href="/home" aria-label="Navigate to the home page">
          <Image
            src={makeItAllLogo}
            alt="Company logo"
            className={styles.companyLogo}
            quality={100}
            priority
          />
        </Link>
      </div>

      <Box flexGrow={1} paddingBottom={3}>
        {content}
      </Box>
    </Box>
  );
}
