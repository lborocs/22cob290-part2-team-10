import { useCallback, useState } from 'react';
import { useRouter } from 'next/router';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import MenuIcon from '@mui/icons-material/Menu';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';

import TextAvatar from '~/components/TextAvatar';
import ThemeSwitcher from '~/components/layout/ThemeSwitcher';
import NavItem from '~/components/layout/nav/NavItem';
import useUserStore from '~/store/userStore';

// TODO: look at using icons, AT LEAST for mobile nav (probably not for desktop)
const userPages = ['Home', 'Forum', 'Projects', 'Dashboard'];
const managerPages = ['Home', 'Forum', 'Projects', 'Dashboard', 'Staff'];

export default function Nav() {
  const router = useRouter();
  const isManager = useUserStore((state) => state.user.isManager);

  const pages = isManager ? managerPages : userPages;

  // mobile menu: https://mui.com/material-ui/react-app-bar/#app-bar-with-responsive-menu
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => setAnchorElNav(event.currentTarget);
  const handleCloseNavMenu = useCallback(() => setAnchorElNav(null), []);

  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={1}
    >
      <ThemeSwitcher />

      {/* mobile nav */}
      <Box sx={{
        display: { xs: 'inline-block', lg: 'none' },
      }}>
        <Button variant="contained" color="contrast" onClick={handleOpenNavMenu}>
          {/* TODO: animate transition */}
          {anchorElNav ? <MenuOpenIcon /> : <MenuIcon />}
        </Button>
        <Menu
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
          open={Boolean(anchorElNav)}
          onClose={handleCloseNavMenu}
          sx={{
            display: { xs: 'block', lg: 'none' },
          }}
        >
          <nav>
            {pages.concat('Profile').map((page) => (
              // TODO: use MobileNavItem
              <MenuItem key={page} onClick={() => {
                router.push(`/${page.toLowerCase()}`);
                handleCloseNavMenu();
              }}>
                {page}
              </MenuItem>
            ))}
          </nav>
        </Menu>
      </Box>

      {/* desktop divider */}
      <Box sx={{ display: { xs: 'none', lg: 'inline-flex' }, height: '100%' }}>
        <Divider orientation="vertical" flexItem />
      </Box>

      {/* desktop nav */}
      <Stack
        direction="row"
        alignItems="center"
        divider={<Divider orientation="vertical" flexItem />}
        spacing={1}
        component={'nav'}
        sx={{
          display: { xs: 'none', lg: 'inline-flex' },
        }}
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
