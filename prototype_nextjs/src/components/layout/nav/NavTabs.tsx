import { useRouter } from 'next/router';
import ButtonBase from '@mui/material/ButtonBase';
import Stack from '@mui/material/Stack';

import type { PageData } from '~/components/layout/NavigationBar';
import { NextLinkComposed } from '~/components/Link';
import { extractPathname } from '~/utils';

export type NavTabsProps = {
  pages: PageData[]
};

/**
 * Desktop navigation using tabs (`lg` breakpoint).
 *
 * Stylistic clone of [MUI nav tabs](https://mui.com/material-ui/react-tabs/#nav-tabs)
 * with customized functionality.
 *
 * - Workaround to not output an error when no tab selected (e.g. when in `/forum/authors`).
 * - Workaround to have a completely custom selected tab indicator
 *
 * @param pages
 * @param open
 * @param closeCollapse
 * @param collapseId
 */
export default function NavTabs({ pages }: NavTabsProps) {
  return (
    <Stack
      direction="row"
      height={1}
      display={{ xs: 'none', lg: 'flex' }}
      component="nav"
      aria-label="website navigation"
      role="tablist"
    >
      {pages.map((page) => (
        <NavTab
          key={extractPathname(page.href)}
          {...page}
        />
      ))}
    </Stack>
  );
}

/**
 * Custom tab component that has the same styling as MUI's Tab,
 *  with a custom indicator.
 */
function NavTab({ label, href }: PageData) {
  const router = useRouter();
  const pathname = extractPathname(href);
  const active = router.pathname === pathname;

  return (
    <ButtonBase
      aria-label={label}
      aria-selected={active}
      role="tab"
      component={NextLinkComposed}
      to={href}
      sx={(theme) => ({
        typography: theme.typography.button,
        paddingX: 2,
        paddingY: 1.5,
        minWidth: '90px', // taken from Tab

        color: 'rgba(0, 0, 0, 0.6)', // taken from Tab (light mode)
        // using `where` for 0 specificity
        [`:where(${theme.getColorSchemeSelector('dark')})`]: {
          color: 'rgba(255, 255, 255, 0.7)', // taken from Tab (dark mode)
        },
        ':hover': {
          // color: theme.vars.palette.contrast.main,
          color: theme.vars.palette.primary.main,
        },

        // indicator
        '::after': {
          content: '""',
          bgcolor: theme.vars.palette.primary.main,
          position: 'absolute',
          left: theme.spacing(2),
          right: theme.spacing(2),
          top: 'calc(100% - 4px)',
          height: '4px',
          transform: 'scaleY(0)',
          transformOrigin: 'bottom',
          // transition shrinking:
          transition: 'transform 150ms ease-in',
        },

        // active
        '&:where([aria-selected="true"])': {
          color: theme.vars.palette.primary.main,
          '::after': {
            transform: 'scaleY(1)',
            // transition growing:
            transition: 'transform 150ms ease-out',
          },
        },

        '@media (prefers-reduced-motion)': {
          '::after': {
            transitionDuration: '0ms',
          },
        },
      })}
    >
      {label}
    </ButtonBase>
  );
}
