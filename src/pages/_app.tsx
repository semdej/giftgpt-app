import { AppProps } from "next/app";
import Head from "next/head";
import { MantineProvider } from "@mantine/core";
import Script from "next/script";

export default function App(props: AppProps) {
  const { Component, pageProps } = props;

  return (
    <>
      <Head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-T51FLHDJZR"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-T51FLHDJZR');
        `}
        </Script>

        <link rel="shortcut icon" href="/favicons/favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/favicons/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicons/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicons/favicon-16x16.png"
        />
        <link rel="mask-icon" href="/favicons/safari-pinned-tab.svg" />
        <meta property="og:image" content="/og-image.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:type" content="image/jpeg" />
        <meta property="og:site_name" content="GiftGPT" />
        <meta property="og:locale" content="en_US" />
        <meta
          property="og:title"
          content="GiftGPT | Find unique gift ideas using the power of GPT-4"
        />
        <meta property="og:url" content="https://gift-gpt.com" />
        <meta property="og:type" content="website" />
        <title>GiftGPT | Find unique gift ideas using the power of GPT-4</title>
        <meta
          name="description"
          content="Find the perfect gift for your friend, family or colleague using the GPT-4 assistant. This tool allows you to easily search for gifts using the GPT-4 model which is enriched using content from over the whole internet!"
        />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>

      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{
          colorScheme: "dark",
        }}
      >
        <Component {...pageProps} />
      </MantineProvider>
    </>
  );
}
