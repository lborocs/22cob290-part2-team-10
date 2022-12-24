import { useRouter } from 'next/router';
import Button, { type ButtonProps } from '@mui/material/Button';

import { NextLinkComposed } from '~/components/Link';

export const navButtonSx = (active: boolean) => ({
  fontSize: '14px',
  color: active ? 'primary.main' : undefined,
  '&:hover': {
    color: 'primary.main',
  },
});

export type NavItemProps = ButtonProps & React.ComponentProps<typeof NextLinkComposed>;

// TODO add underline same color https://www.youtube.com/watch?v=nS1UrJnncWc
export default function NavItem(props: NavItemProps) {
  const router = useRouter();

  const path = typeof props.to === 'string' ? props.to : props.to.pathname!;

  const active = router.pathname.startsWith(path);

  return (
    <Button
      variant="text"
      color="contrast"
      size="small"
      sx={navButtonSx(active)}
      component={NextLinkComposed}
      {...props}
    />
  );
}
