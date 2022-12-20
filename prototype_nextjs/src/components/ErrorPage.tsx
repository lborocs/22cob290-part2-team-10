import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { NextLinkComposed } from '~/components/Link';

export type ErrorPageProps = {
  title: string
  buttonContent?: React.ReactNode
  buttonUrl: string
};

/**
 * Custom error page that can be embedded in our layout (the `Error` component from Next
 *  isn't great because it won't fit in our layout because it tries to occupy the entire viewport).
 *
 * @param title
 * @param buttonContent
 * @param buttonUrl
 * @see https://nextjs.org/docs/advanced-features/custom-error-page
 */
export default function ErrorPage({
  title,
  buttonContent = 'Back',
  buttonUrl,
}: ErrorPageProps) {
  return (
    <Stack
      direction="column"
      flexGrow={1}
      alignItems="center"
      justifyContent="center"
      component="main"
    >
      <Typography
        sx={{
          fontSize: '24px',
          fontWeight: 500,
          lineHeight: '49px',
        }}
        component="h2"
      >
        {title}
      </Typography>

      <Button
        variant="contained"
        color="secondary"
        component={NextLinkComposed}
        to={buttonUrl}
      >
        {buttonContent}
      </Button>
    </Stack>
  );
}
