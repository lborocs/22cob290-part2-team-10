import type { PaletteMode } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useLocalStorage } from 'usehooks-ts';

export type ThemeMode = PaletteMode | 'system';

export default function useThemeMode() {
  const [storedMode, setStoredMode] = useLocalStorage<ThemeMode>('theme', 'system');

  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  let paletteMode: PaletteMode;
  if (storedMode === 'system') {
    paletteMode = prefersDarkMode ? 'dark' : 'light';
  } else {
    paletteMode = storedMode;
  }

  return {
    paletteMode,
    storedMode,
    setStoredMode,
  } as const;
}
