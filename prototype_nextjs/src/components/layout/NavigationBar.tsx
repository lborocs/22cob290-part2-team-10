import { useCallback, useState } from 'react';
import { useRouter } from 'next/router';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button, { type ButtonProps } from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Toolbar from '@mui/material/Toolbar';
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
import MenuIcon from '@mui/icons-material/Menu';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';

import { NextLinkComposed } from '~/components/Link';
import TextAvatar from '~/components/TextAvatar';
import ThemeSwitcher from '~/components/layout/ThemeSwitcher';
import useUserStore from '~/store/userStore';

// TODO: look at using icons, AT LEAST for mobile nav (probably not for desktop)
const userPages = ['Home', 'Forum', 'Projects', 'Dashboard'];
const managerPages = ['Home', 'Forum', 'Projects', 'Dashboard', 'Staff'];

export default function NavigationBar({ noSidebar, toggleSidebar, title }: {
  noSidebar: boolean
  toggleSidebar: () => void
  title: React.ReactNode
}) {
  const renderToggleSidebarButton = !noSidebar && (
    <Button
      onClick={toggleSidebar}
      variant="contained"
      color="secondary"
      sx={(theme) => ({
        px: 1.5,
        ':hover': {
          bgcolor: theme.palette.makeItAllOrange.main,
        },
      })}
    >
      <FormatAlignLeftIcon />
      <Box sx={{
        display: {
          xs: 'none',
          md: 'inline-block',
        },
        marginLeft: {
          md: 1,
        },
      }}>
        Toggle Sidebar
      </Box>
    </Button>
  );

  return (
    <AppBar position="static">
      <Toolbar>
        {/* left */}
        <Box sx={{
          width: '100%',
        }}>
          {renderToggleSidebarButton}
        </Box>
        {/* middle */}
        <Box sx={{
          width: '100%',
          display: 'flex',
        }}>
          <Box sx={{
            mx: 'auto',
          }}>
            {title}
          </Box>
        </Box>
        {/* right */}
        <Box sx={{
          width: '100%',
          display: 'flex',
          justifyContent: 'flex-end',
        }}>
          <LayoutNav />
        </Box>
      </Toolbar>
    </AppBar>
  );
}

function LayoutNav() {
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

// TODO: MobileNavItem
// TODO: active style
function MobileNavItem({
  page,
  handleCloseNavMenu,
  children = page,
}: React.PropsWithChildren<{ page: string, handleCloseNavMenu: () => void }>) {
  const router = useRouter();

  const url = `/${page.toLowerCase()}`;

  const active = router.pathname.startsWith(url);

  return (
    <NavItem
      to={url}
      onClick={() => {
        // TODO?: maybe try and change to button with NextLinkComposed?
        router.push(`/${page.toLowerCase()}`);
        handleCloseNavMenu();
      }}
    >
      {children}
    </NavItem>
  );
}

// TODO: maybe change from Button to MUI Link (or whatever its called)
function NavItem(props: ButtonProps & React.ComponentProps<typeof NextLinkComposed>) {
  const router = useRouter();

  const active = router.pathname.startsWith(props.to as string);

  return (
    <Button
      variant="text"
      color="contrast"
      size="small"
      sx={(theme) => ({
        fontSize: '14px',
        color: active ? theme.palette.primary.main : undefined,
        '&:hover': {
          color: theme.palette.primary.main,
        },
      })}
      component={NextLinkComposed}
      {...props}
    />
  );
}
