import type { AppProps } from 'next/app';
import { SessionProvider, useSession } from 'next-auth/react';
import { config } from '@fortawesome/fontawesome-svg-core';

// put global css imports before component imports because otherwise:
//  it will put the component css before the global css in the head,
//  so the global will get precedence when styling a component
//  which is bad because the components won't look how we want them to look
import '@fortawesome/fontawesome-svg-core/styles.css';
import 'bootstrap/dist/css/bootstrap.min.css';
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
