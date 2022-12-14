import { BrightnessHigh, Moon } from 'react-bootstrap-icons';
import { useTheme } from 'next-themes';

import styles from '~/styles/layout/ThemeSwitcher.module.css';

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  const isDark = theme === 'dark';

  const toggleTheme = () => setTheme(isDark ? 'light' : 'dark');

  return (
    <button
      onClick={toggleTheme}
      className={`pe-2 ${styles.themeSwitcher}`}
    >
      {isDark ? <Moon /> : <BrightnessHigh />}
    </button>
  );
}
