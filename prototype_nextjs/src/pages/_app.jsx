/* eslint-disable @typescript-eslint/no-unsafe-return */
import { SessionProvider, useSession } from 'next-auth/react';

import 'bootstrap/dist/css/bootstrap.min.css';
import '~/styles/globals.css';

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
