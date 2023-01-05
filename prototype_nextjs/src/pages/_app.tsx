import type { AppProps } from 'next/app';
import Head from 'next/head';
import { SessionProvider, useSession } from 'next-auth/react';
import {
  type ColorSystemOptions,
  experimental_extendTheme as extendTheme,
  Experimental_CssVarsProvider as CssVarsProvider,
} from '@mui/material/styles';
import { grey } from '@mui/material/colors';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import { config } from '@fortawesome/fontawesome-svg-core';
import { Toaster, ToastBar } from 'react-hot-toast';

// see https://mui.com/material-ui/experimental-api/css-theme-variables/usage/#typescript
import type { } from '@mui/material/themeCssVarsAugmentation';

import Layout from '~/components/Layout';
import LoadingPage from '~/components/LoadingPage';
import useUserStore from '~/store/userStore';
import type { AppPage } from '~/types';

import '@fortawesome/fontawesome-svg-core/styles.css';
// Roboto is MUI default font
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import '~/styles/globals.css';

// https://fontawesome.com/v5/docs/web/use-with/react#getting-font-awesome-css-to-work
config.autoAddCss = false;

/**
 * @see https://mui.com/material-ui/customization/theming/#custom-variables
 * @see https://mui.com/material-ui/customization/palette/#adding-new-colors
 * @see https://mui.com/material-ui/experimental-api/css-theme-variables/customization/#typescript
 */
declare module '@mui/material/styles' {
  interface Theme {
  }

  interface Palette {
    light: Palette['primary'];
    dark: Palette['primary'];
    contrast: Palette['primary']; // contrast to theme
    makeItAllGrey: Palette['primary'];
    makeItAllOrange: Palette['primary'];
  }
  interface PaletteOptions {
    light?: PaletteOptions['primary'];
    dark?: PaletteOptions['primary'];
    contrast?: PaletteOptions['primary'];
    makeItAllGrey?: PaletteOptions['primary'];
    makeItAllOrange?: PaletteOptions['primary'];
  }

  // allow configuration using `createTheme`
  interface ThemeOptions {
  }
}

interface ColorOverrides {
  light: true;
  dark: true;
  contrast: true;
  makeItAllGrey: true;
  makeItAllOrange: true;
}

declare module '@mui/material/Button' {
  interface ButtonPropsColorOverrides extends ColorOverrides { }
}

declare module '@mui/material/ButtonGroup' {
  interface ButtonGroupPropsColorOverrides extends ColorOverrides { }
}

declare module '@mui/material/Chip' {
  interface ChipPropsColorOverrides extends ColorOverrides { }
}

declare module '@mui/material/CircularProgress' {
  interface CircularProgressPropsColorOverrides extends ColorOverrides { }
}

declare module '@mui/material/FormLabel' {
  interface FormLabelPropsColorOverrides extends ColorOverrides { }
}

declare module '@mui/material/IconButton' {
  interface IconButtonPropsColorOverrides extends ColorOverrides { }
}

declare module '@mui/material/InputBase' {
  interface InputBasePropsColorOverrides extends ColorOverrides { }
}

declare module '@mui/material/TextField' {
  interface TextFieldPropsColorOverrides extends ColorOverrides { }
}

const commonPalette: ColorSystemOptions['palette'] = {
  light: {
    main: grey[50],
    dark: grey[300],
    contrastText: '#000',
  },
  dark: {
    main: grey[900],
    dark: grey[800], // the color is actually lighter but using dark for hover
    contrastText: '#fff',
  },
  makeItAllOrange: {
    light: '#f4dc49',
    main: '#e2ba39',
    dark: '#ffa726', // default palette.warning.main
  },
  makeItAllGrey: {
    main: '#d3d3d3',
    contrastText: '#000',
  },
  primary: {
    main: '#e2ba39', // makeItAllOrange.main
  },
  secondary: {
    main: '#d3d3d3', // makeItAllGrey.main
  },
};

const theme = extendTheme({
  colorSchemes: {
    light: {
      palette: {
        ...commonPalette,
        primary: {
          light: '#e2ba39', // makeItAllOrange.main
          main: '#ffa726', // makeItAllOrange.dark
          // TODO: decide whether to use makeItAllOrange.main as primary.main
          // or not, sometimes its fine, sometimes it's too light
        },
        contrast: commonPalette.dark,
      },
    },
    dark: {
      palette: {
        ...commonPalette,
        contrast: commonPalette.light,
        text: {
          primary: 'rgba(255, 255, 255, 0.9)',
        },
      },
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: ({ ownerState, theme }) => ({
          [theme.getColorSchemeSelector('light')]: {
            backgroundColor: '#fafafa',
          },
        }),
      },
    },
    MuiButton: {
      styleOverrides: {
        root: ({ ownerState, theme }) => ({
          // textTransform: 'none',
        }),
      },
      variants: [
        // makeItAllGrey is too light in light mode
        {
          props: { variant: 'outlined', color: 'secondary' },
          style: ({ theme }) => ({
            [theme.getColorSchemeSelector('light')]: {
              color: theme.vars.palette.grey[700],
              borderColor: theme.vars.palette.grey[700],
            },
          }),
        },
        {
          props: { variant: 'text', color: 'secondary' },
          style: ({ theme }) => ({
            [theme.getColorSchemeSelector('light')]: {
              color: theme.vars.palette.grey[700],
              borderColor: theme.vars.palette.grey[700],
            },
          }),
        },
      ],
    },
    MuiInputBase: {
      styleOverrides: {
        root: ({ ownerState, theme }) => ({
          // same caretColor as input color
          caretColor: ownerState.color && theme.vars.palette[ownerState.color].main,
          '&.Mui-error': {
            // error color caret on error
            caretColor: theme.vars.palette.error.main,
          },
        }),
      },
    },
  },
});

interface MyAppProps extends AppProps {
  Component: AppProps['Component'] & AppPage
}

/**
 * The root component of the app. It is used to initialize pages.
 *
 * @see https://nextjs.org/docs/advanced-features/custom-app
 */
export default function App({
  Component,
  pageProps,
}: MyAppProps) {
  if (pageProps.user) {
    useUserStore.setState(() => ({
      user: pageProps.user,
    }));
  }

  const { noAuth, layout } = Component;

  return (
    <SessionProvider session={pageProps.session}>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <CssVarsProvider theme={theme} defaultMode="system">
        <CssBaseline />

        <ThemedToaster />

        <Box height="100vh">
          {noAuth ? (
            <Component {...pageProps} />
          ) : (
            <Auth>
              {layout ? (
                <Layout {...layout}>
                  <Component {...pageProps} />
                </Layout>
              ) : (
                <Component {...pageProps} />
              )}
            </Auth>
          )}
        </Box>
      </CssVarsProvider>
    </SessionProvider>
  );
}

function ThemedToaster() {
  return (
    <Toaster
      toastOptions={{
        duration: 6000,
        success: {
          duration: 5000,
        },
      }}
    >
      {(t) => (
        <Box
          sx={(theme) => ({
            [theme.getColorSchemeSelector('dark')]: {
              '> *': {
                backgroundColor: '#333',
                color: '#fff',
              },
            },
          })}
        >
          <ToastBar
            style={t.style}
            toast={t}
          />
        </Box>
      )}
    </Toaster>
  );
}

function Auth({ children }: { children: React.ReactNode }) {
  // if `{ required: true }` is supplied, `status` can only be 'loading' or 'authenticated'
  const { status } = useSession({ required: true });

  if (status === 'loading') {
    return (
      <Box height="100vh" width="100vw">
        <LoadingPage />
      </Box>
    );
  }

  return <>{children}</>;
}
