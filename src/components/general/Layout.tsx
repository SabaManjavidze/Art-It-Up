import Head from "next/head";
import React, { useEffect, useState } from "react";
import { Footer } from "./Footer";
import { BarLoader } from "react-spinners";
import { Router } from "next/router";

export default function Layout({
  title = "Art It Up",
  children,
}: {
  title?: string;
  children: React.ReactElement | React.ReactElement[] | null;
}) {
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    Router.events.on("routeChangeStart", (url) => {
      setIsLoading(true);
    });

    Router.events.on("routeChangeComplete", (url) => {
      setIsLoading(false);
    });

    Router.events.on("routeChangeError", (url) => {
      setIsLoading(false);
    });
  }, [Router]);
  return (
    <>
      <Head>
        <title>{title ? title + " - Art It Up" : "Art It Up"}</title>
        <meta name="description" content="Ecommerce Website" />
        <link rel="icon" href="/favicon.ico" />
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
