import CircularProgress, { type CircularProgressProps } from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';

export type LoadingPageProps = {
  dark?: boolean
  size?: CircularProgressProps['size']
};

/**
 * A component displaying an infinitely spinning spinner to represent something
 *  is loading.
 *
 * @param dark if `true`, black background & light spinner; else default background & dark spinner
 * @param size spinner size
 */
export default function LoadingPage({
  dark = true,
  size = 32,
}: LoadingPageProps) {
  return (
    <Stack
      height="100%"
      width="100%"
      justifyContent="center"
      alignItems="center"
      bgcolor={(theme) => (dark ? theme.palette.dark.main : undefined)}
    >
      <CircularProgress
        size={size}
        color={dark ? 'light' : 'dark'}
      />
    </Stack>
  );
}
