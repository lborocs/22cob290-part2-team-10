import type { PaletteMode } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useLocalStorage } from 'usehooks-ts';

export type ThemeMode = PaletteMode | 'system';

/**
 * A hook that returns the current theme mode and a function to set it.
 *
 * @returns {object} An object containing the current theme mode and a function to set it.
 * @returns {PaletteMode} paletteMode The current palette mode.
 * @returns {ThemeMode} storedMode The current theme mode stored in local storage.
 * @returns {function} setStoredMode A function to set the theme mode in local storage.
 *
 * @example
 * const { paletteMode, storedMode, setStoredMode } = useThemeMode();
 * setStoredMode('dark');
 * setStoredMode('system');
 * setStoredMode('light');
 *
 * @see https://usehooks-ts.com/react-hook/use-local-storage
 * @see https://mui.com/material-ui/customization/dark-mode/
 */
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
