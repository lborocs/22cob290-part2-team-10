import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { IconButton, styled } from '@mui/material/';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button, { type ButtonProps } from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Toolbar from '@mui/material/Toolbar';
import { grey } from '@mui/material/colors';
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
import FormatAlignJustifyIcon from '@mui/icons-material/FormatAlignJustify';
import MenuIcon from '@mui/icons-material/Menu';

import { NextLinkComposed } from '~/components/Link';
import TextAvatar from '~/components/TextAvatar';
import ThemeSwitcher from '~/components/layout/ThemeSwitcher';
import useUserStore from '~/store/userStore';

import styles from '~/styles/Layout.module.css';

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

// TODO: active style
function NavButton(props: ButtonProps & React.ComponentProps<typeof NextLinkComposed>) {
  const router = useRouter();

  return (
    <Button
      size="small"
      component={NextLinkComposed}
      sx={(theme) => ({
        color: theme.palette.mode === 'dark' ? 'white' : 'black',
      })}
      {...props}
    />
  );
}

function LayoutNav() {
  const isManager = useUserStore((state) => state.user.isManager);

  const pages = isManager ? managerPages : userPages;

  // TODO: mobile menu

  return (
    <Stack
      direction="row"
      spacing={1}
    >
      <ThemeSwitcher />
      <Box sx={{
        display: { xs: 'inline-block', lg: 'none' },
      }}>
        <Button variant="contained" color="contrast">
          <MenuIcon />
        </Button>
      </Box>
      <Box sx={{ display: { xs: 'none', lg: 'inline-flex' }, height: '100%' }}>
        <Divider orientation="vertical" flexItem />
      </Box>
      <Stack
        direction="row"
        divider={<Divider orientation="vertical" flexItem />}
        spacing={1}
        component={'nav'}
        sx={{
          display: { xs: 'none', lg: 'inline-flex' },
        }}
      >
        {pages.map((page, index) => (
          <NavButton
            key={index}
            to={{
              pathname: `/${page.toLowerCase()}`,
            }}
          >
            {page}
          </NavButton>
        ))}
        <NavButton
          to={{
            pathname: '/profile',
          }}
        >
          <Profile />
        </NavButton>
      </Stack>
    </Stack>
  );

  // return (
  //   <Nav
  //     activeKey={router.pathname}
  //     className="align-items-lg-center"
  //   >
  //     <ThemeSwitcher />
  //     <Link href="/home" passHref legacyBehavior>
  //       <Nav.Link>Home</Nav.Link>
  //     </Link>
  //     <Link href="/forum" passHref legacyBehavior>
  //       <Nav.Link>Forum</Nav.Link>
  //     </Link>
  //     <Link href="/projects" passHref legacyBehavior>
  //       <Nav.Link>Projects</Nav.Link>
  //     </Link>
  //     <Link href="/dashboard" passHref legacyBehavior>
  //       <Nav.Link>Dashboard</Nav.Link>
  //     </Link>
  //     {isManager && (
  //       <Link href="/staff_assignment" passHref legacyBehavior>
  //         <Nav.Link>Staff</Nav.Link>
  //       </Link>
  //     )}
  //     <Link href="/profile" passHref legacyBehavior>
  //       <Nav.Link><Profile /></Nav.Link>
  //     </Link>
  //   </Nav>
  // );
}

function Profile() {
  return (
    <>
      <Box sx={{ display: { xs: 'inline', lg: 'none' } }}>
        Profile
      </Box>
      <Box sx={{ display: { xs: 'none', lg: 'inline' } }}>
        <TextAvatar />
      </Box>
    </>
  );
}
