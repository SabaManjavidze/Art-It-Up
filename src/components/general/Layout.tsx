import Head from "next/head";
import React, { useEffect, useState } from "react";
import { Footer } from "./Footer";
import { BarLoader } from "react-spinners";
import { Router } from "next/router";
import TabVisibility from "./TabVisibility";
import { COMEBACK_MESSAGE } from "@/utils/constants";

export default function Layout({
  title = "Art It Up",
  children,
}: {
  title?: string;
  children: React.ReactElement | React.ReactElement[] | null;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const isTabVisible = TabVisibility();
  useEffect(() => {
    Router.events.on("routeChangeStart", () => {
      setIsLoading(true);
    });

    Router.events.on("routeChangeComplete", () => {
      setIsLoading(false);
    });

    Router.events.on("routeChangeError", () => {
      setIsLoading(false);
    });
  }, [Router]);
  return (
    <>
      <Head>
        <title>{isTabVisible ? title : COMEBACK_MESSAGE}</title>
        <meta name="description" content="Ecommerce Website" />
        <link rel="icon" href="/favicon.ico" />
        <link
          href="https://fonts.cdnfonts.com/css/tt-firs-neue-trl"
          rel="stylesheet"
        />
      </Head>
      <div className="flex min-h-screen flex-col justify-between bg-background text-primary-foreground">
        <BarLoader
          loading={isLoading}
          className="!fixed z-50 !w-full !bg-cyan-500"
          height={6}
        />
        <main>{children}</main>
        <Footer />
      </div>
    </>
  );
}
