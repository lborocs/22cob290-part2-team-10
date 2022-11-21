/* eslint-disable @typescript-eslint/no-unsafe-return */
import { SessionProvider, useSession } from 'next-auth/react';
import { config } from '@fortawesome/fontawesome-svg-core';

import '@fortawesome/fontawesome-svg-core/styles.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '~/styles/globals.css';

// https://fontawesome.com/v5/docs/web/use-with/react#getting-font-awesome-css-to-work
config.autoAddCss = false;

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <SessionProvider session={session}>
      {Component.noauth ? (
        <Component {...pageProps} />
      ) : (
        <Auth>
          <Component {...pageProps} />
        </Auth>
      )}
    </SessionProvider>
  );
}

function Auth({ children }) {
  // if `{ required: true }` is supplied, `status` can only be 'loading' or 'authenticated'
  const { status } = useSession({ required: true });

  // TODO: show a page central loading spinner
  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  return children;
}
