import IconButton from '@mui/material/IconButton';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';

import useColorMode from '~/store/colorMode';

export default function ThemeSwitcher() {
  const mode = useColorMode((state) => state.mode);
  const toggleColorMode = useColorMode((state) => state.toggleColorMode);

  const isDark = mode === 'dark';

  return (
    <IconButton
      aria-label="toggle theme"
      onClick={toggleColorMode}
      size="small"
    >
      {isDark
        ? <DarkModeIcon />
        : <LightModeIcon sx={{ color: 'black' }} />}
    </IconButton>
  );
}
