import { Component } from 'react';
import Head from 'next/head';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { NextLinkComposed } from '~/components/Link';

type ErrorBoundaryState = {
  hasError: boolean;
};

class ErrorBoundary extends Component<any, ErrorBoundaryState> {
  constructor(props: any) {
    super(props);

    // Define a state variable to track whether is an error or not
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: unknown) {
    // Update state so the next render will show the fallback UI

    return { hasError: true };
  }

  componentDidCatch(error: unknown, errorInfo: unknown) {
    // You can use your own error logging service here
    console.log({ error, errorInfo });
  }

  render() {
    // Check if the error is thrown
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <Stack
          alignItems="center"
          justifyContent="center"
          height="100vh"
          maxWidth="sm"
          gap={1}
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
            There has been an error
          </Typography>

          <Typography
            sx={(theme) => ({
              color: '#444',
              [theme.getColorSchemeSelector('dark')]: {
                color: '#888',
              },
            })}
          >
            We apologize for the inconvenience, but it seems that there has been
            an error while attempting to access our website. This could be due
            to a problem with your browser or device, or it might be an issue on
            our part. Please try again later or contact us if the problem
            persists.
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
    }

    // Return children components in case of no error

    return this.props.children;
  }
}

export default ErrorBoundary;
