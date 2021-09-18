import React from 'react';
import Document, {
  Html, Head, Main, NextScript,
} from 'next/document';
import { ServerStyleSheets } from '@material-ui/core/styles';

const APP_NAME = 'Pel';
const APP_DESCRIPTION = 'Pel';
// TODO: Add meta data
class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const sheets = new ServerStyleSheets();
    const originalRenderPage = ctx.renderPage;

    ctx.renderPage = () => originalRenderPage({
      enhanceApp: (App) => (props) => sheets.collect(<App {...props} />),
    });

    const initialProps = await Document.getInitialProps(ctx);

    return {
      ...initialProps,
      // Styles fragment is rendered after the app and page rendering finish.
      styles: [
        ...React.Children.toArray(initialProps.styles),
        sheets.getStyleElement(),
      ],
    };
  }

  render() {
    return (
      <Html lang="en">
        <Head>
          <meta httpEquiv="content-type" content="text/html; charset=UTF8" />
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
          {/* <link rel="manifest" href="/manifest.json" /> */}
          <meta name="application-name" content={APP_NAME} />
          {/* <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta
            name="apple-mobile-web-app-status-bar-style"
            content="default"
          /> */}
          {/* <meta name="apple-mobile-web-app-title" content={APP_NAME} /> */}
          <meta name="description" content={APP_DESCRIPTION} />
          {/* <meta name="mobile-web-app-capable" content="yes" /> */}
          <meta name="theme-color" content="#30BDB4" />
          <link
            href="https://api.tiles.mapbox.com/mapbox-gl-js/v1.11.1/mapbox-gl.css"
            rel="stylesheet"
          />
        </Head>
        <body className="overflow-hidden">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
