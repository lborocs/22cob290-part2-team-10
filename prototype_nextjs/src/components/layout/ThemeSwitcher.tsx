import { useEffect, useState } from 'react';
import IconButton from '@mui/material/IconButton';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { useTheme } from 'next-themes';

// TODO: MUI themes

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  // https://github.com/pacocoursey/next-themes#avoid-hydration-mismatch
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isDark = theme === 'dark';

  const toggleTheme = () => setTheme(isDark ? 'light' : 'dark');

  return (
    <IconButton
      aria-label="toggle theme"
      onClick={toggleTheme}
      size="small"
    >
      {isDark
        ? <DarkModeIcon sx={{ color: 'white' }} />
        : <LightModeIcon sx={{ color: 'black' }} />}
    </IconButton>
  );
}
