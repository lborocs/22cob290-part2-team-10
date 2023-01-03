import { Html, Head, Main, NextScript } from 'next/document';
import { getInitColorSchemeScript } from '@mui/material/styles';

/**
 * @see https://nextjs.org/docs/advanced-features/custom-document
 * @see https://mui.com/material-ui/experimental-api/css-theme-variables/migration/#3-prevent-dark-mode-flickering-in-server-side-applications
 */
export default function Document() {
  return (
    <Html
      lang="en"
    >
      <Head />
      <body>
        {getInitColorSchemeScript()}
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
