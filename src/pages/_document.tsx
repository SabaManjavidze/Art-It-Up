import TabVisibility from "@/components/general/TabVisibility";
import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html>
      <Head>
        <meta name="description" content="Ecommerce Website" />
        <link rel="icon" href="/favicon.ico" />
        <link
          href="https://fonts.cdnfonts.com/css/tt-firs-neue-trl"
          rel="stylesheet"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
