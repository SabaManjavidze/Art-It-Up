import React from "react";
import { Loader2 } from "lucide-react";
import { api } from "../../utils/api";
import { CheckoutProvider } from "../../hooks/useCheckoutHooks";
import CartPage from "../../components/WrappedPages/CartPage";

const UserCart = () => {
  const { data, isLoading, error } = api.cart.getCart.useQuery();
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 color="white" />
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex items-center justify-center">
        <h1>{error.message}</h1>
      </div>
    );
  }
  return (
    <CheckoutProvider products={data}>
      <CartPage />
    </CheckoutProvider>
  );
};

export default UserCart;

import type { GetServerSideProps } from "next";
import superjson from "superjson";
import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import { getServerAuthSession } from "../../server/auth";
import { appRouter } from "../../server/api/root.router";
import { createContextInner } from "../../server/api/trpc";
import { SIGNIN_ROUTE } from "@/utils/constants";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerAuthSession({
    req: context.req,
    res: context.res,
  });
  const ssg = createProxySSGHelpers({
    router: appRouter,
    ctx: await createContextInner({ session }),
    transformer: superjson,
  });

  await ssg.cart.getCart.prefetch();
  let redirect: { permanent: boolean; destination: string } | undefined;
  if (!session) {
    redirect = {
      permanent: false,
      destination: SIGNIN_ROUTE,
    };
  }
  return {
    redirect,
    props: {
      trpcState: ssg.dehydrate(),
    },
  };
};
