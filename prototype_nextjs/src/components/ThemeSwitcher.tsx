import { useEffect, useId, useState } from 'react';
import { styled, useColorScheme } from '@mui/material/styles';
import Box, { type BoxProps } from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Skeleton from '@mui/material/Skeleton';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import SettingsBrightnessIcon from '@mui/icons-material/SettingsBrightness';
import type { Entries } from 'type-fest';

const ResponsiveStyledButton = styled(Button)(({ theme }) => theme.unstable_sx({
  textTransform: 'none',
  display: {
    xs: 'none',
    md: 'inline-flex',
  },
}));

const ResponsiveIconButton = styled(IconButton)(({ theme }) => theme.unstable_sx({
  display: {
    xs: 'inline-flex',
    md: 'none',
  },
}));

type ModeType = NonNullable<ReturnType<typeof useColorScheme>['mode']>;

type Modes = {
  [mode in ModeType]: {
    label: string
    buttonIcon: React.ReactNode
    menuIcon: React.ReactNode
  }
};

const modes: Modes = {
  system: {
    label: 'OS Default',
    buttonIcon: <SettingsBrightnessIcon />,
    menuIcon: <SettingsBrightnessIcon />,
  },
  light: {
    label: 'Light',
    buttonIcon: <LightModeOutlinedIcon />,
    menuIcon: <LightModeOutlinedIcon />,
  },
  dark: {
    label: 'Dark',
    buttonIcon: <DarkModeOutlinedIcon />,
    menuIcon: <DarkModeOutlinedIcon />,
  },
};

/**
 * Want the button to look like an `Outlined Button` when the text is visible,
 *  and like an `IconButton` when the text isn't. Too much styling customization
 *  needed if just using 1 button so just used 2 lol.
 */
export default function ThemeSwitcher(props: BoxProps) {
  // it includes system, really nice :)
  const { mode, setMode } = useColorScheme();

  const buttonId = useId();
  const menuId = useId();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const menuOpen = anchorEl !== null;

  // see https://github.com/pacocoursey/next-themes#avoid-hydration-mismatch
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !mode) return (
    <Box {...props} component={Skeleton}>
      <ResponsiveStyledButton
        variant="outlined"
        startIcon={<SettingsBrightnessIcon />}
      >
        Theme
      </ResponsiveStyledButton>
      <ResponsiveIconButton>
        <SettingsBrightnessIcon />
      </ResponsiveIconButton>
    </Box>
  );

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (mode: ModeType) => {
    setMode(mode);
    setAnchorEl(null);
  };

  return (
    <>
      <Box {...props}>
        <ResponsiveStyledButton
          onClick={handleClick}
          variant="outlined"
          color="contrast"
          startIcon={modes[mode].buttonIcon}
          id={buttonId}
          aria-label="open theme switcher"
          aria-controls={menuOpen ? menuId : undefined}
          aria-haspopup="true"
          aria-expanded={menuOpen ? true : undefined}
        >
          Theme
        </ResponsiveStyledButton>
        {/* TODO: sort out id & aria props :/ might have to use useMediaQuery(minWidth: theme.breakpoints.md) or some sort of useBreakpoint */}
        <ResponsiveIconButton
          onClick={handleClick}
          color="contrast"
        // id={buttonId}
        // aria-label="open theme switcher"
        // aria-controls={menuOpen ? menuId : undefined}
        // aria-haspopup="true"
        // aria-expanded={menuOpen ? true : undefined}
        >
          {modes[mode].buttonIcon}
        </ResponsiveIconButton>
      </Box>

      <Menu
        open={menuOpen}
        anchorEl={anchorEl}
        onClose={handleClose}
        id={menuId}
        MenuListProps={{
          'aria-labelledby': buttonId,
        }}
      >
        {(Object.entries(modes) as Entries<typeof modes>).map(([_mode, { label, menuIcon }]) => (
          <MenuItem
            key={_mode}
            onClick={() => handleMenuItemClick(_mode)}
            selected={mode === _mode}
          >
            <ListItemIcon>
              {menuIcon}
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
