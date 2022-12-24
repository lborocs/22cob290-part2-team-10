import { useCallback, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Menu from '@mui/material/Menu';
import Stack from '@mui/material/Stack';
import MenuIcon from '@mui/icons-material/Menu';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';

import TextAvatar from '~/components/TextAvatar';
import ThemeSwitcher from '~/components/layout/ThemeSwitcher';
import MobileNavItem from '~/components/layout/nav/MobileNavItem';
import NavItem from '~/components/layout/nav/NavItem';
import useUserStore from '~/store/userStore';

// TODO: look at using icons, AT LEAST for mobile nav (probably not for desktop)
const userPages = ['Home', 'Forum', 'Projects', 'Dashboard'];
const managerPages = ['Home', 'Forum', 'Projects', 'Dashboard', 'Staff'];

// mobile menu: https://mui.com/material-ui/react-app-bar/#app-bar-with-responsive-menu
export default function Nav() {
  const isManager = useUserStore((state) => state.user.isManager);

  const pages = isManager ? managerPages : userPages;

  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);

  const open = Boolean(anchorElNav);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => setAnchorElNav(event.currentTarget);
  const handleCloseNavMenu = useCallback(() => setAnchorElNav(null), []);

  return (
    <Stack direction="row" alignItems="center" spacing={1}>
      <ThemeSwitcher />

      {/* mobile nav */}
      <Box display={{ xs: 'inline-block', lg: 'none' }}>
        <Button
          variant="contained"
          color="contrast"
          onClick={handleOpenNavMenu}
          aria-controls="mobile-nav"
          aria-expanded={open}
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
            id="mobile-nav"
            aria-expanded={open}
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
            open={open}
            onClose={handleCloseNavMenu}
            sx={{
              display: { xs: 'block', lg: 'none' },
            }}
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

      {/* desktop divider */}
      <Box display={{ xs: 'none', lg: 'inline-flex' }} height="100%">
        <Divider orientation="vertical" flexItem />
      </Box>

      {/* desktop nav */}
      <Stack
        direction="row"
        alignItems="center"
        divider={<Divider orientation="vertical" flexItem />}
        spacing={1}
        component={'nav'}
        display={{ xs: 'none', lg: 'inline-flex' }}
      >
        {pages.map((page) => (
          <NavItem
            key={page}
            to={`/${page.toLowerCase()}`}
          >
            {page}
          </NavItem>
        ))}
        <NavItem to="/profile">
          <TextAvatar />
        </NavItem>
      </Stack>
    </Stack>
  );
}