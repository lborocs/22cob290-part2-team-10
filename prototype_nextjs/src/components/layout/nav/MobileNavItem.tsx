import { useRouter } from 'next/router';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';

import { NextLinkComposed } from '~/components/Link';

const navButtonSx = (active: boolean) => ({
  fontSize: '14px',
  color: active ? 'primary.main' : undefined,
  '&:hover': {
    color: 'primary.main',
  },
});

export default function MobileNavItem({
  page,
  handleCloseNavMenu,
  children,
}: React.PropsWithChildren<{ page: string, handleCloseNavMenu: () => void }>) {
  const router = useRouter();

  const url = `/${page.toLowerCase()}`;

  const active = router.pathname.startsWith(url);

  return (
    <MenuItem
      onClick={handleCloseNavMenu}
      sx={navButtonSx(active)}
      component={NextLinkComposed}
      to={url}
    >
      <Typography variant="button" color="inherit">
        {children}
      </Typography>
    </MenuItem>
  );
}
