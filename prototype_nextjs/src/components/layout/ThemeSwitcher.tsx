import { useId, useState } from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button, { type ButtonProps } from '@mui/material/Button';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import SettingsBrightnessIcon from '@mui/icons-material/SettingsBrightness';
import type { Entries } from 'type-fest';

import useThemeMode, { type ThemeMode } from '~/store/themeMode';

const StyledButton = styled(Button)(({ theme }) => theme.unstable_sx({
  textTransform: 'none',
  minWidth: 0,
  '& .MuiButton-startIcon': {
    marginRight: {
      xs: 0,
      md: 1,
    },
    marginLeft: {
      xs: 0,
      md: -0.5,
    },
  },
}));

type Modes = {
  [mode in ThemeMode]: {
    label: string
    icon: React.ReactNode
  }
};

const modes: Modes = {
  system: {
    label: 'OS Default',
    icon: <SettingsBrightnessIcon />,
  },
  light: {
    label: 'Light',
    icon: <LightModeOutlinedIcon />,
  },
  dark: {
    label: 'Dark',
    icon: <DarkModeOutlinedIcon />,
  },
};

export default function ThemeSwitcher(props: ButtonProps) {
  const { storedMode, setStoredMode } = useThemeMode();

  const buttonId = useId();
  const menuId = useId();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const menuOpen = anchorEl !== null;

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (mode: ThemeMode) => {
    setStoredMode(mode);
    setAnchorEl(null);
  };

  return (
    <>
      <StyledButton
        onClick={handleClick}
        variant="outlined"
        color="contrast"
        startIcon={modes[storedMode].icon}
        id={buttonId}
        aria-label="open theme switcher"
        aria-controls={menuOpen ? menuId : undefined}
        aria-haspopup="true"
        aria-expanded={menuOpen ? true : undefined}
        {...props}
      >
        <Box
          display={{
            xs: 'none',
            md: 'inline',
          }}
          component="span"
        >
          Theme
        </Box>
      </StyledButton>

      <Menu
        open={menuOpen}
        anchorEl={anchorEl}
        onClose={handleClose}
        id={menuId}
        MenuListProps={{
          'aria-labelledby': buttonId,
        }}
      >
        {(Object.entries(modes) as Entries<typeof modes>).map(([mode, { label, icon }]) => (
          <MenuItem
            key={mode}
            onClick={() => handleMenuItemClick(mode)}
            selected={storedMode === mode}
          >
            <ListItemIcon>
              {icon}
            </ListItemIcon>
            <ListItemText>
              {label}
            </ListItemText>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
