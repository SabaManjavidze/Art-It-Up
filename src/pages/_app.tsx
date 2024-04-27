import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

import { api } from "../utils/api";

import "../styles/globals.css";
import "../styles/selectSearch.css";
import Navbar from "../components/general/NavBar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Layout from "@/components/general/Layout";
import { SearchProvider } from "@/hooks/useSearchHook";
import { ModalProvider } from "@/hooks/useLoginModal";
import { useEffect } from "react";
import { WHITELIST_SESS_KEY } from "@/utils/general/constants";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <Layout>
        <SearchProvider>
          <Navbar />
        </SearchProvider>
        <ModalProvider>
          <Component {...pageProps} />
          <ToastContainer limit={1} position="bottom-center" />
        </ModalProvider>
      </Layout>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
