import Link from 'next/link';
import { useRouter } from 'next/router';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';

import { navButtonSx } from '~/components/layout/nav/NavItem';

export default function MobileNavItem({
  page,
  handleCloseNavMenu,
  children,
}: React.PropsWithChildren<{ page: string, handleCloseNavMenu: () => void }>) {
  const router = useRouter();

  const url = `/${page.toLowerCase()}`;

  const active = router.pathname.startsWith(url);

  return (
    <Link href={url}>
      <MenuItem onClick={handleCloseNavMenu} sx={navButtonSx(active)}>
        <Typography variant="button" color="inherit">
          {children}
        </Typography>
      </MenuItem>
    </Link>
  );
}
