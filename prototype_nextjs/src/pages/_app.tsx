import type { AppProps } from 'next/app';
import Head from 'next/head';
import { SessionProvider, useSession } from 'next-auth/react';
import { config } from '@fortawesome/fontawesome-svg-core';

import Layout, { type SidebarType } from '~/components/Layout';
import LoadingPage from '~/components/LoadingPage';
import useUserStore from '~/store/userStore';

import '@fortawesome/fontawesome-svg-core/styles.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '~/styles/globals.css';

// https://fontawesome.com/v5/docs/web/use-with/react#getting-font-awesome-css-to-work
config.autoAddCss = false;

type Page = {
  noAuth?: boolean
  sidebarType?: SidebarType
  sidebarContent?: React.ReactNode
};

interface MyAppProps extends AppProps {
  Component: AppProps['Component'] & Page
}

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: MyAppProps) {
  if (pageProps.user) {
    useUserStore.setState((state) => ({
      ...state,
      user: pageProps.user,
    }));
  }

  const { noAuth, sidebarType, sidebarContent } = Component;

  return (
    <SessionProvider session={session}>
      <Head>
        <title>Make-It-All</title>
      </Head>
      {noAuth ? (
        <Component {...pageProps} />
      ) : (
        <Auth>
          {sidebarType ? (
            <Layout
              sidebarType={sidebarType}
              sidebarContent={sidebarContent}
            >
              <Component {...pageProps} />
            </Layout>
          ) : (
            <Component {...pageProps} />
          )}
        </Auth>
      )}
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
