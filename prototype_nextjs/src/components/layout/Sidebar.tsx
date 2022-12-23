import { useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { deepmerge } from '@mui/utils';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Box from '@mui/material/Box';

import { commonThemeOptions, lightThemeOptions } from '~/pages/_app';
import styles from '~/styles/layout/Sidebar.module.css';
import makeItAllLogo from '~/../public/company-logo.png';

export type SidebarProps = {
  show: boolean
  content: React.ReactNode
};

// TODO?: make sidebar sticky? (have its scroll separate to the page)
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
      <Box
        className={`${styles.sidebar} ${show ? '' : styles.hidden}`}
        bgcolor="makeItAllGrey.main"
        color="black"
        component="aside"
      >
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

        <Box flexGrow={1} paddingTop={0} paddingBottom={3}>
          {content}
        </Box>
      </Box>
    </ThemeProvider>
  );
}
