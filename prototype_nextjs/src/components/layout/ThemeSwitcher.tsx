import IconButton from '@mui/material/IconButton';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';

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
      color="contrast"
    >
      {isDark ? <DarkModeOutlinedIcon /> : <LightModeOutlinedIcon />}
    </IconButton>
  );
}
