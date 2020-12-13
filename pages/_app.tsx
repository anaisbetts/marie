import React from 'react';
import Head from 'next/head';

import '../styles/globals.css';
import '../components/setup-firebase';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        ></meta>
      </Head>
      <Component {...pageProps} />;
    </>
  );
}

export default MyApp;
