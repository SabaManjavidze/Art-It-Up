import React, { useState } from "react";
import { Loader2 } from "lucide-react";
import type { RouterOutputs } from "../../utils/api";
import { api } from "../../utils/api";
import { CheckoutProvider, useCheckout } from "../../hooks/useCheckoutHooks";
import SummarySection from "@/components/cartPageComponents/SummarySection";
import { ShippingAddressSection } from "@/components/cartPageComponents/ShippingAddressSection";

const UserCart = () => {
  const { data: products, isLoading, error } = api.cart.getCart.useQuery();
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
    <CheckoutProvider products={products}>
      <div className="text-skin-base min-h-screen w-full bg-background ">
        <div className="py-12">
          <ShippingAddressSection />
        </div>
        <div className="flex flex-col justify-end lg:flex-row">
          <div
            className="w-full py-4 pr-4 
        md:py-8 md:pr-6 lg:py-14 lg:pr-8"
          >
            <p className="ml-12 pt-9 text-3xl font-black leading-10 dark:text-primary-foreground lg:text-4xl">
              Cart
            </p>

            <div className="mt-4">
              {products.length < 1 ? (
                <div className="mt-16 flex px-12">
                  <p className="text-lg">No Products In Your Cart</p>
                </div>
              ) : (
                products.map((cartProduct, prodIdx) => {
                  return (
                    <CartProduct
                      key={cartProduct.productId}
                      cartProduct={cartProduct}
                      prodIdx={prodIdx}
                    />
                  );
                })
              )}
            </div>
          </div>
          <div className="mt-32 mr-5 h-full w-full bg-gray-100 dark:bg-gray-800 md:w-full lg:w-96">
            {products.length > 0 && <SummarySection />}
          </div>
        </div>
      </div>
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
import { SIGNIN_ROUTE } from "@/utils/general/constants";
import { SelectableCard } from "@/components/ui/SelectableCard";
import CartProductCard from "@/components/cartPageComponents/CartProductCard";

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
  await ssg.address.getUserAddress.prefetch();
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
function CartProduct({
  cartProduct,
}: {
  cartProduct: RouterOutputs["cart"]["getCart"][number];
  prodIdx: number;
}) {
  const { handleSelectProduct, selected } = useCheckout();

  return (
    <SelectableCard
      handleSelect={() => handleSelectProduct(cartProduct.productId)}
      isSelected={!!selected.find((item) => item == cartProduct.productId)}
    >
      <CartProductCard
        key={cartProduct.productId}
        title={cartProduct.product.title}
        src={cartProduct.product.picture}
        size={{ id: cartProduct.sizeId, title: cartProduct.sizeTitle }}
        productId={cartProduct.productId}
        quantity={cartProduct.quantity}
        href={`/product/${cartProduct.productId}`}
        description={cartProduct.product.description}
        price={cartProduct.price / 100}
      />
    </SelectableCard>
  );
}
