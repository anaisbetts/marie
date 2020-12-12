import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html>
        <Head>
          <meta name="application-name" content="Marie" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta
            name="apple-mobile-web-app-status-bar-style"
            content="default"
          />
          <link
            rel="apple-touch-icon"
            href="/icons/android-chrome-384x384.png"
          />

          <meta name="apple-mobile-web-app-title" content="Marie" />
          <meta name="description" content="Keep your house clutter-free!" />
          <meta name="format-detection" content="telephone=no" />
          <meta name="mobile-web-app-capable" content="yes" />
          <meta name="theme-color" content="#000000" />

          <link rel="manifest" href="/manifest.json" />
          <link rel="shortcut icon" href="/favicon.ico" />

          <meta name="twitter:card" content="summary" />
          <meta name="twitter:url" content="https://marie.anais.dev" />
          <meta name="twitter:title" content="Marie" />
          <meta
            name="twitter:description"
            content="Keep your house clutter-free!"
          />
          <meta
            name="twitter:image"
            content="https://marie.anais.dev/icons/android-chrome-192x192.png"
          />
          <meta name="twitter:creator" content="@anaisbetts" />
          <meta property="og:type" content="website" />
          <meta property="og:title" content="Marie" />
          <meta
            property="og:description"
            content="Keep your house clutter-free!"
          />
          <meta property="og:site_name" content="Marie" />
          <meta property="og:url" content="https://marie.anais.dev" />
          <meta
            property="og:image"
            content="https://marie.anais.dev/icons/android-chrome-192x192.png"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
