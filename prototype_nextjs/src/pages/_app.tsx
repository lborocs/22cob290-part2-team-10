import { type CSSProperties, useEffect, useMemo } from 'react';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { SessionProvider, useSession } from 'next-auth/react';
import { deepmerge } from '@mui/utils';
import { type ThemeOptions, createTheme, useTheme, ThemeProvider } from '@mui/material/styles';
import { grey } from '@mui/material/colors';
import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import { config } from '@fortawesome/fontawesome-svg-core';
import { Toaster, ToastBar } from 'react-hot-toast';

import Layout from '~/components/Layout';
import LoadingPage from '~/components/LoadingPage';
import useUserStore from '~/store/userStore';
import useColorMode from '~/store/colorMode';
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

// https://mui.com/material-ui/customization/theming/#custom-variables
// https://mui.com/material-ui/customization/palette/#adding-new-colors
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

export const commonThemeOptions: ThemeOptions = {
  palette: {
    light: {
      main: grey[200],
      dark: grey[400],
      contrastText: '#000',
    },
    dark: {
      main: grey[900],
      light: grey[700],
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
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          // textTransform: 'none',
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: ({ ownerState, theme }) => ({
          // same caretColor as input color
          caretColor: ownerState.color && theme.palette[ownerState.color].main,
          '&.Mui-error': {
            // red caret on error
            caretColor: 'red',
          },
        }),
      },
    },
  },
};

export const lightThemeOptions: ThemeOptions = {
  palette: {
    mode: 'light',
    primary: {
      light: '#e2ba39', // makeItAllOrange.main
      main: '#ffa726', // makeItAllOrange.dark
      // TODO: decide whether to use makeItAllOrange.main as primary.main
      // or not, sometimes its fine, sometimes it's too light
    },
    contrast: commonThemeOptions.palette!.dark,
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#fff',
        },
      },
    },
    MuiButton: {
      variants: [
        // makeItAllGrey is too light
        {
          props: { variant: 'outlined', color: 'secondary' },
          style: {
            color: grey[700],
            borderColor: grey[700],
          },
        },
        {
          props: { variant: 'text', color: 'secondary' },
          style: {
            color: grey[700],
            borderColor: grey[700],
          },
        },
      ],
    },
  },
};

export const darkThemeOptions: ThemeOptions = {
  palette: {
    mode: 'dark',
    contrast: commonThemeOptions.palette?.light,
  },
  typography: {
    allVariants: {
      color: 'rgba(255, 255, 255, 0.9)',
    },
  },
};

interface MyAppProps extends AppProps {
  Component: AppProps['Component'] & AppPage
}

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: MyAppProps) {
  if (pageProps.user) {
    useUserStore.setState((state) => ({
      user: pageProps.user,
    }));
  }

  const mode = useColorMode((state) => state.mode);
  const setColorMode = useColorMode((state) => state.setColorMode);

  const theme = useMemo(
    () => createTheme(
      deepmerge(
        commonThemeOptions,
        mode === 'dark' ? darkThemeOptions : lightThemeOptions
      )
    ),
    [mode]
  );

  // TODO: store current mode in localstorage somehow like how next-themes does
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  useEffect(() => {
    // TODO: get mode from localStorage, if null then use preference
    setColorMode(prefersDarkMode ? 'dark' : 'light');
  }, [prefersDarkMode, setColorMode]);

  const { noAuth, layout } = Component;

  return (
    <SessionProvider session={session}>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />

        <ThemedToaster />

        <Box minHeight="100vh">
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
      </ThemeProvider>
    </SessionProvider>
  );
}

function ThemedToaster() {
  const theme = useTheme();

  const darkToastStyle: CSSProperties = {
    backgroundColor: '#333',
    color: '#fff',
  };

  const lightToastStyle: CSSProperties = {
  };

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
        <ToastBar
          style={{
            ...t.style,
            ...theme.palette.mode === 'dark' ? darkToastStyle : lightToastStyle,
          }}
          toast={t}
        />
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
