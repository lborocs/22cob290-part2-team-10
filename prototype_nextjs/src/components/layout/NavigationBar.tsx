import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Toolbar from '@mui/material/Toolbar';
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';

import LayoutNav from '~/components/layout/nav/Nav';

export default function NavigationBar({ noSidebar, toggleSidebar, title }: {
  noSidebar: boolean
  toggleSidebar: () => void
  title: React.ReactNode
}) {
  const renderToggleSidebarButton = !noSidebar && (
    <Button
      onClick={toggleSidebar}
      variant="contained"
      color="secondary"
      sx={(theme) => ({
        px: 1.5,
        ':hover': {
          bgcolor: theme.palette.makeItAllOrange.main,
        },
      })}
    >
      <FormatAlignLeftIcon />
      <Box sx={{
        display: {
          xs: 'none',
          md: 'inline-block',
        },
        marginLeft: {
          md: 1,
        },
      }}>
        Toggle Sidebar
      </Box>
    </Button>
  );

  return (
    <AppBar position="static">
      <Toolbar>
        {/* left */}
        <Box sx={{
          width: '100%',
        }}>
          {renderToggleSidebarButton}
        </Box>
        {/* middle */}
        <Box sx={{
          width: '100%',
          display: 'flex',
        }}>
          <Box sx={{
            mx: 'auto',
          }}>
            {title}
          </Box>
        </Box>
        {/* right */}
        <Box sx={{
          width: '100%',
          display: 'flex',
          justifyContent: 'flex-end',
        }}>
          <LayoutNav />
        </Box>
      </Toolbar>
    </AppBar>
  );
}
