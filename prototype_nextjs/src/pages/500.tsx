import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { NextLinkComposed } from '~/components/Link';

/**
 * Custom 500 page that is pretty much a clone of the 404, with different text content.
 *
 * @see https://nextjs.org/docs/advanced-features/custom-error-page#customizing-the-500-page
 */
const Custom500 = () => (
  <Stack
    alignItems="center"
    justifyContent="center"
    height={1}
    maxWidth="sm"
    gap={1}
    marginX="auto"
    paddingX={4}
    component="main"
  >
    <Typography
      fontWeight="bold !important"
      sx={{
        typography: {
          xs: 'h4',
          sm: 'h3',
        },
      }}
      component="h1"
    >
      500 — Server Error
    </Typography>

    <Typography
      sx={(theme) => ({
        color: '#444',
        [theme.getColorSchemeSelector('dark')]: {
          color: '#888',
        },
      })}
    >
      {`
      We're sorry, but an error occurred on our server while processing your request.
      This is likely a temporary issue and should be resolved shortly.
      Please try again later or contact us if the problem persists.
      We apologize for any inconvenience this may have caused.
      `}
    </Typography>

    <Button
      variant="contained"
      color="contrast"
      size="large"
      component={NextLinkComposed}
      to="/home"
      sx={{
        textTransform: 'none',
        paddingX: 8,
        paddingY: 2,
        borderRadius: 2.5,
        ':hover': {
          color: 'contrast.contrastText',
        },
      }}
      disableElevation
    >
      Return Home
    </Button>
  </Stack>
);

export default Custom500;
