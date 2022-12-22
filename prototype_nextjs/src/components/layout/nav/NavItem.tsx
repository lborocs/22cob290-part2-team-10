import { useRouter } from 'next/router';
import Button, { type ButtonProps } from '@mui/material/Button';

import { NextLinkComposed } from '~/components/Link';

// TODO: maybe change from Button to MUI Link (or whatever its called)
export default function NavItem(props: ButtonProps & React.ComponentProps<typeof NextLinkComposed>) {
  const router = useRouter();

  const active = router.pathname.startsWith(props.to as string);

  return (
    <Button
      variant="text"
      color="contrast"
      size="small"
      sx={(theme) => ({
        fontSize: '14px',
        color: active ? theme.palette.primary.main : undefined,
        '&:hover': {
          color: theme.palette.primary.main,
        },
      })}
      component={NextLinkComposed}
      {...props}
    />
  );
}

