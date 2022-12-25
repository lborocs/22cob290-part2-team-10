import IconButton, { type IconButtonProps } from '@mui/material/IconButton';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';

import useColorMode from '~/store/colorMode';

export type ThemeSwitcherProps = IconButtonProps;

export default function ThemeSwitcher(props: ThemeSwitcherProps) {
  const mode = useColorMode((state) => state.mode);
  const toggleColorMode = useColorMode((state) => state.toggleColorMode);

  const isDark = mode === 'dark';

  return (
    <IconButton
      aria-label="toggle theme"
      onClick={toggleColorMode}
      size="small"
      color="contrast"
      {...props}
    >
      {isDark ? <DarkModeOutlinedIcon /> : <LightModeOutlinedIcon />}
    </IconButton>
  );
}
