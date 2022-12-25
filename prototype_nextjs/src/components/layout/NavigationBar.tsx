import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Toolbar from '@mui/material/Toolbar';

import ThemeSwitcher from '~/components/layout/ThemeSwitcher';
import Nav from '~/components/layout/nav/Nav';

/**
 * - Material UI's `FormatAlignLeftIcon` doesn't look great
 * - For some reason using FontAwesome's `faAlignLeft` gives a slightly different icon
 *    (the corners are too rounded)
 * - So just copied the svg element from when we used FontAwesome on sci-project, looks
 *    much better
 *
 * https://fontawesome.com/icons/align-left
 *
 * Turns out we used FontAwesome v5 on sci-project and the icon was updated in
 *   FontAwesome v6
 *
 * https://fontawesome.com/v5/icons/align-left?s=solid&f=classic
 */
const faAlignLeftSvg = (
  <svg
    // className="svg-inline--fa fa-align-left fa-w-14"
    style={{
      display: 'inline-block',
      boxSizing: 'content-box',
      height: '1em',
      overflow: 'visible',
    }}
    aria-hidden="true"
    data-prefix="fas"
    data-icon="align-left"
    role="img"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 448 512"
  >
    <path
      fill="currentColor"
      d="M288 44v40c0 8.837-7.163 16-16 16H16c-8.837 0-16-7.163-16-16V44c0-8.837 7.163-16 16-16h256c8.837 0 16 7.163 16 16zM0 172v40c0 8.837 7.163 16 16 16h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 7.163-16 16zm16 312h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16zm256-200H16c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16h256c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16z"
    />
  </svg>
);

// TODO?: navbar sticky to top? if so then blur
export default function NavigationBar({ noSidebar, toggleSidebar, title }: {
  noSidebar: boolean
  toggleSidebar: () => void
  title: React.ReactNode
}) {
  const renderToggleSidebarButton = !noSidebar && (
    <Button
      onClick={toggleSidebar}
      variant="contained"
      color="makeItAllGrey"
      aria-label="Toggle Sidebar"
      sx={(theme) => ({
        paddingX: 1.5,
        height: `calc(1.5rem + ${theme.spacing(1.5)})`,
        minWidth: 0,
        ':hover': {
          bgcolor: theme.palette.makeItAllOrange.main,
        },
      })}
    >
      {faAlignLeftSvg}
      <Box
        display={{
          xs: 'none',
          md: 'inline',
        }}
        marginLeft={{
          md: 1,
        }}
        component="span"
      >
        Toggle Sidebar
      </Box>
    </Button>
  );

  return (
    <AppBar position="static">
      <Toolbar>
        {/* left */}
        <Box width="100%" height="100%" display="flex" alignItems="center">
          {renderToggleSidebarButton}
        </Box>
        {/* middle */}
        {title && (
          <Box width="100%" height="100%" display="flex" alignItems="center">
            <Box marginX="auto">
              {title}
            </Box>
          </Box>
        )}
        {/* right */}
        <Box width="100%" height="100%" display="flex" alignItems="center" justifyContent="flex-end">
          <ThemeSwitcher sx={{ marginRight: 1.5 }} />
          <Nav />
        </Box>
      </Toolbar>
    </AppBar>
  );
}
