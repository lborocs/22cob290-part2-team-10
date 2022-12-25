import { useCallback, useId, useState } from 'react';
import { useRouter } from 'next/router';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import MenuIcon from '@mui/icons-material/Menu';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';

import TextAvatar from '~/components/TextAvatar';
import MobileNavItem from '~/components/layout/nav/MobileNavItem';
import useUserStore from '~/store/userStore';

// TODO: look at using icons, AT LEAST for mobile nav (probably not for desktop)
const userPages = ['Home', 'Forum', 'Projects', 'Dashboard'];
const managerPages = ['Home', 'Forum', 'Projects', 'Dashboard', 'Staff'];

// mobile menu: https://mui.com/material-ui/react-app-bar/#app-bar-with-responsive-menu
// tabs nav: https://mui.com/material-ui/react-tabs/#nav-tabs
export default function Nav() {
  const router = useRouter();

  const menuId = useId();

  const isManager = useUserStore((state) => state.user.isManager);

  const pages = isManager ? managerPages : userPages;

  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);

  const isMenuOpen = anchorElNav !== null;

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => setAnchorElNav(event.currentTarget);
  const handleCloseNavMenu = useCallback(() => setAnchorElNav(null), []);

  const handleTabChange = (event: React.SyntheticEvent, newPage: string) => {
    router.push(`/${newPage}`);
  };

  return (
    <>
      {/* mobile nav */}
      <Box display={{ xs: 'block', lg: 'none' }}>
        {/* TODO: change nav button to be same size width as toggle sidebar button (when only icon)
        might have to use custom svg (which will make animating transition easier)
         */}
        <Button
          variant="contained"
          color="contrast"
          onClick={handleOpenNavMenu}
          aria-controls={menuId}
          aria-expanded={isMenuOpen}
          aria-label={`${isMenuOpen ? 'close' : 'open'} navigation menu`}
          sx={(theme) => ({
            paddingX: 1.5,
            height: `calc(1.5rem + ${theme.spacing(1.5)})`,
            minWidth: 0,
          })}
        >
          {/* TODO: animate transition */}
          {anchorElNav ? <MenuOpenIcon /> : <MenuIcon />}
        </Button>
        <nav>
          <Menu
            id={menuId}
            aria-expanded={isMenuOpen}
            anchorEl={anchorElNav}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
            open={isMenuOpen}
            onClose={handleCloseNavMenu}
          >
            {pages.concat('Profile').map((page) => (
              <MobileNavItem
                key={page}
                page={page}
                handleCloseNavMenu={handleCloseNavMenu}
              >
                {page}
              </MobileNavItem>
            ))}
          </Menu>
        </nav>
      </Box>

      {/* desktop nav */}
      <Tabs
        value={router.pathname.split('/')[1]}
        onChange={handleTabChange}
        aria-label="page navigation"
        component="nav"
        sx={{
          display: {
            xs: 'none',
            lg: 'flex',
          },
          height: '100%',
          '& .MuiTabs-flexContainer': {
            height: '100%',
          },
        }}
      >
        {pages.map((page) => (
          <Tab
            key={page}
            value={page.toLowerCase()}
            label={page}
            tabIndex={0}
            aria-label={`navigate to the ${page} page`}
            component="a"
            href={`/${page.toLowerCase()}`}
            onClick={(event: React.MouseEvent) => {
              event.preventDefault();
            }}
          />
        ))}
        <Tab
          value="profile"
          // label={<TextAvatar />}
          label="Profile"
          tabIndex={0}
          aria-label="navigate to the profile page"
          component="a"
          href="/profile"
          onClick={(event: React.MouseEvent) => {
            event.preventDefault();
          }}
        />
      </Tabs>
    </>
  );
}
