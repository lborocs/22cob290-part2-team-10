import Head from 'next/head';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { NextLinkComposed } from '~/components/Link';
import type { AppPage } from '~/types';

/**
 * We can't use `pages/404` because we use `{ notFound: true }` when the user isn't signed
 *  in to redirect to the sign in page and have improved prop typing. If we used `pages/404`,
 *  that page would show instead of redirecting to the sign in page.
 *
 * We workaround this by using a [catch all route](https://nextjs.org/docs/routing/dynamic-routes#catch-all-routes)
 *  to catch all routes that we haven't defined in our app
 *
 * [Documentation](https://nextjs.org/docs/advanced-features/custom-error-page#404-page)
 *
 * [Styling inspiration](https://github.com/leerob/leerob.io/blob/main/pages/404.tsx)
 */
const Custom404: AppPage = () => (
  <Stack
    alignItems="center"
    justifyContent="center"
    height={1}
    maxWidth="sm"
    spacing={1}
    marginX="auto"
    paddingX={4}
    component="main"
  >
    <Head>
      <title>404 - Make-It-All</title>
    </Head>

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
      404 — This page does not exist
    </Typography>

    <Typography
      sx={(theme) => ({
        color: theme.palette.mode === 'dark' ? '#888' : '#444',
      })}
    >
      Sorry, the webpage you are trying to access is not available.
      It may have been moved or removed, or there may be a typo in the URL.
      If you believe this is a broken link, please let us know so we can fix it.
      Thank you for your patience.
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
          // for some reason it's broken on this page
          color: 'contrast.contrastText',
        },
      }}
      disableElevation
    >
      Return Home
    </Button>
  </Stack>
);

Custom404.noAuth = true;

export default Custom404;
