import type { AppProps } from 'next/app';
import Head from 'next/head';
import { SessionProvider, useSession } from 'next-auth/react';
import Typography from '@mui/material/Typography';
import { config } from '@fortawesome/fontawesome-svg-core';
import { Toaster, ToastBar } from 'react-hot-toast';
import { ThemeProvider } from 'next-themes';

// put global css imports before component imports because otherwise:
//  it will put the component css before the global css in the head,
//  so the global will get precedence when styling a component
//  which is bad because the components won't look how we want them to look
import '@fortawesome/fontawesome-svg-core/styles.css';
// import 'bootstrap/dist/css/bootstrap.min.css';
// Roboto is MUI default font
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import '~/styles/globals.css';

import Layout from '~/components/Layout';
import LoadingPage from '~/components/LoadingPage';
import useUserStore from '~/store/userStore';
import type { AppPage } from '~/types';

// https://fontawesome.com/v5/docs/web/use-with/react#getting-font-awesome-css-to-work
config.autoAddCss = false;

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

  const { noAuth, layout } = Component;

  return (
    <SessionProvider session={session}>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <ThemeProvider>
        <Toaster>
          {(t) => (
            <ToastBar toast={t}>
              {({ icon, message }) => (
                <>
                  {icon}
                  <Typography component={'div'}>
                    {message}
                  </Typography>
                </>
              )}
            </ToastBar>
          )}
        </Toaster>

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
      </ThemeProvider>
    </SessionProvider>
  );
}

function Auth({ children }: { children: React.ReactNode }) {
  // if `{ required: true }` is supplied, `status` can only be 'loading' or 'authenticated'
  const { status } = useSession({ required: true });

  if (status === 'loading') {
    return (
      <div className="vh-100 vw-100">
        <LoadingPage />
      </div>
    );
  }

  return <>{children}</>;
}
