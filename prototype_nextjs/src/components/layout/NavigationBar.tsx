import { useId, useState } from 'react';
import Link from 'next/link';
import { styled } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Toolbar from '@mui/material/Toolbar';
import MenuIcon from '@mui/icons-material/Menu';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import type { UrlObject } from 'url';

import TextAvatar from '~/components/TextAvatar';
import ThemeSwitcher from '~/components/layout/ThemeSwitcher';
import NavCollapse from '~/components/layout/nav/NavCollapse';
import NavTabs from '~/components/layout/nav/NavTabs';
import useUserStore from '~/store/userStore';

export type PageData = {
  label: string // page
  href: UrlObject | string
};
// TODO: look at using icons, AT LEAST for mobile nav if menu (probably not for desktop)

const userPages: PageData[] = [
  { label: 'Home', href: '/home' },
  { label: 'Forum', href: '/forum' },
  { label: 'Projects', href: '/projects' },
  { label: 'Dashboard', href: '/dashboard' },
];
const managerPages: PageData[] = [
  { label: 'Home', href: '/home' },
  { label: 'Forum', href: '/forum' },
  { label: 'Projects', href: '/projects' },
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Staff', href: '/staff' },
];

const NavBarBox = styled(Box)({
  // width: '100%',
  flexBasis: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
});

/**
 * - Material UI's `FormatAlignLeftIcon` doesn't look great
 * - For some reason using FontAwesome's `faAlignLeft` gives a slightly different icon
 *    (the corners are too rounded)
 * - So just copied the svg element from when we used FontAwesome on sci-project, looks
 *    much better
 *
 * https://fontawesome.com/icons/align-left
 *
 * Turns out we used FontAwesome v5 on sci-project and the icon was updated in
 *   FontAwesome v6
 *
 * https://fontawesome.com/v5/icons/align-left?s=solid&f=classic
 */
const faAlignLeftSvg = (
  <svg
    // className="svg-inline--fa fa-align-left fa-w-14"
    style={{
      display: 'inline-block',
      boxSizing: 'content-box',
      height: '1em',
      overflow: 'visible',
    }}
    aria-hidden="true"
    data-prefix="fas"
    data-icon="align-left"
    role="img"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 448 512"
  >
    <path
      fill="currentColor"
      d="M288 44v40c0 8.837-7.163 16-16 16H16c-8.837 0-16-7.163-16-16V44c0-8.837 7.163-16 16-16h256c8.837 0 16 7.163 16 16zM0 172v40c0 8.837 7.163 16 16 16h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 7.163-16 16zm16 312h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16zm256-200H16c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16h256c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16z"
    />
  </svg>
);

export type NavigationBarProps = {
  noSidebar: boolean
  toggleSidebar: () => void
};

// TODO?: navbar sticky to top? if so then blur after scoll
export default function NavigationBar({
  noSidebar,
  toggleSidebar,
}: NavigationBarProps) {
  const isManager = useUserStore((state) => state.user.isManager);
  const pages = isManager ? managerPages : userPages;

  const collapseId = useId();

  const [isCollapseOpen, setIsCollapseOpen] = useState(false);

  const handleToggleCollapse = () => setIsCollapseOpen((open) => !open);
  const handleCloseCollapse = () => setIsCollapseOpen(false);

  const toggleSidebarButton = !noSidebar && (
    <Button
      onClick={toggleSidebar}
      variant="contained"
      color="makeItAllGrey"
      aria-label="Toggle Sidebar"
      sx={(theme) => ({
        paddingX: 1.5,
        height: `calc(1.5rem + ${theme.spacing(1.5)})`,
        minWidth: 0,
        ':hover': {
          bgcolor: theme.palette.makeItAllOrange.main,
        },
      })}
    >
      {faAlignLeftSvg}
      <Box
        display={{
          xs: 'none',
          md: 'inline',
        }}
        marginLeft={{
          md: 1,
        }}
        component="span"
      >
        Toggle Sidebar
      </Box>
    </Button>
  );

  return (
    <AppBar
      position="static"
      elevation={2}
    >
      <Toolbar>
        {/* left */}
        <NavBarBox>
          {toggleSidebarButton}
        </NavBarBox>
        {/* middle */}
        <NavBarBox justifyContent="center">
          <NavTabs pages={pages} />
        </NavBarBox>
        {/* right */}
        <NavBarBox justifyContent="end">
          <ThemeSwitcher marginRight={{ xs: 0.5, md: 1.5 }} />

          <Box
            display={{ xs: 'none', lg: 'block' }}
          >
            <Link href="/profile">
              <TextAvatar />
            </Link>
          </Box>

          {/* TODO: change nav button to be same size width as toggle sidebar button (when only icon)
          might have to use custom svg (which will make animating transition easier)
           */}
          <Button
            variant="contained"
            color="contrast"
            onClick={handleToggleCollapse}
            aria-controls={collapseId}
            aria-expanded={isCollapseOpen}
            aria-label={`${isCollapseOpen ? 'collapse' : 'open'} navigation menu`}
            sx={(theme) => ({
              paddingX: 1.5,
              height: `calc(1.5rem + ${theme.spacing(1.5)})`,
              minWidth: 0,
              display: { xs: 'block', lg: 'none' },
            })}
          >
            {/* TODO: animate transition */}
            {isCollapseOpen ? <MenuOpenIcon /> : <MenuIcon />}
          </Button>
        </NavBarBox>
      </Toolbar>
      <NavCollapse
        pages={pages.concat({ label: 'Profile', href: '/profile' })}
        collapseId={collapseId}
        open={isCollapseOpen}
        closeCollapse={handleCloseCollapse}
      />
    </AppBar>
  );
}
