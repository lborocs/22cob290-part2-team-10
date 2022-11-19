import type { AppProps } from 'next/app';

import 'bootstrap/dist/css/bootstrap.min.css';
import '~/styles/globals.css';

// TODO: default layout (navbar, sidebar)

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Component {...pageProps} />
  );
}
