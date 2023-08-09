import Head from "next/head";
import React from "react";
import { Footer } from "./Footer";

export default function Layout({
  title = "Art It Up",
  children,
}: {
  title?: string;
  children: React.ReactElement | React.ReactElement[] | null;
}) {
  return (
    <>
      <Head>
        <title>{title ? title + " - Art It Up" : "Art It Up"}</title>
        <meta name="description" content="Ecommerce Website" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex min-h-screen flex-col justify-between bg-background text-primary-foreground">
        <main>{children}</main>
        <Footer />
      </div>
    </>
  );
}
