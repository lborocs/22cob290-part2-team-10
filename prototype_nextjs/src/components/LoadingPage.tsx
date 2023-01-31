import CircularProgress, {
  type CircularProgressProps,
} from '@mui/material/CircularProgress';
import Stack, { type StackProps } from '@mui/material/Stack';

export type LoadingPageProps = StackProps & {
  size?: CircularProgressProps['size'];
};

/**
 * A component displaying an infinitely spinning spinner to represent something
 *  is loading.
 *
 * @param dark if `true`, black background & light spinner; else default background & dark spinner
 * @param size spinner size
 */
export default function LoadingPage({ size = 32, ...props }: LoadingPageProps) {
  return (
    <Stack
      height="100%"
      width="100%"
      justifyContent="center"
      alignItems="center"
      {...props}
    >
      <CircularProgress size={size} color="contrast" />
    </Stack>
  );
}
