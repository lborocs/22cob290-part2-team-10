import { useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { deepmerge } from '@mui/utils';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import { commonThemeOptions, lightThemeOptions } from '~/pages/_app';
import styles from '~/styles/layout/Sidebar.module.css';
import makeItAllLogo from '~/../public/company-logo.png';

export type SidebarProps = {
  show: boolean
  content: React.ReactNode
};

export default function Sidebar({ show, content }: SidebarProps) {
  // override app theme for sidebar - at least until configured sidebar colours in dark mode
  const theme = useMemo(
    () => createTheme(
      deepmerge(
        commonThemeOptions, lightThemeOptions
      )
    ),
    []
  );

  return (
    <ThemeProvider theme={theme}>
      <aside className={`${styles.sidebar} ${show ? '' : styles.hidden}`}>
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
    </ThemeProvider>
  );
}
