import Head from "next/head";
import React, { useEffect, useState } from "react";
import { Footer } from "./Footer";
import { BarLoader } from "react-spinners";
import { Router } from "next/router";
import TabVisibility from "./TabVisibility";
import { COMEBACK_MESSAGE } from "@/utils/general/constants";

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
      </Head>
      <div className="flex min-h-screen flex-col justify-between bg-background text-primary-foreground">
        <BarLoader
          loading={isLoading}
          className="!fixed z-50 !w-full !bg-accent"
          height={6}
        />
        <main>{children}</main>
        <Footer />
      </div>
    </>
  );
}
