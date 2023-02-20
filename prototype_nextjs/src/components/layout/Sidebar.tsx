import Link from 'next/link';
import Image from 'next/image';
import Box from '@mui/material/Box';
import clsx from 'clsx';

import styles from '~/styles/layout/Sidebar.module.css';
import makeItAllLogo from '~/../public/assets/company-logo.png';

export type SidebarProps = {
  show: boolean;
  content: React.ReactNode;
};

export default function Sidebar({ show, content }: SidebarProps) {
  return (
    <Box
      className={clsx(styles.sidebar, !show && styles.hidden)}
      bgcolor="makeItAllGrey.main"
      color="black"
      component="aside"
      // override app theme for sidebar - at least until configured sidebar colours in dark mode
      // TODO: configure sidebar colours in dark mode
      data-mui-color-scheme="light"
      position="fixed"
      sx={{
        inset: 0,
      }}
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
