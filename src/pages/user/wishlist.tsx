import WishProductCard from "@/components/wishListPageComponents/WishProductCard";
import { api } from "@/utils/api";
import React from "react";

export default function index() {
  const {
    data: products,
    isLoading,
    error,
  } = api.wishList.getWishList.useQuery();
  if (error) {
    return (
      <div className="flex items-center justify-center">
        <h1>{error.message}</h1>
      </div>
    );
  }
  if (isLoading) return <h1>something went wrong</h1>;

  return (
    <div className="container mx-auto flex items-center justify-center px-4 py-12 md:px-6 2xl:px-0">
      <div className="jusitfy-start flex flex-col items-start">
        <div className="mt-3">
          <h1 className="text-3xl font-semibold leading-8 tracking-tight text-gray-800 lg:text-4xl lg:leading-9">
            WishList
          </h1>
        </div>
        <div className="mt-4">
          <p className="text-2xl leading-6 tracking-tight text-gray-600">
            {products.length} Items
          </p>
        </div>
        <div className="mt-10 grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-2 lg:mt-12 lg:grid-cols-3">
          {products.map(({ product, price, size }) => (
            <WishProductCard
              key={product.id}
              description={product.description}
              href={`/product/${product.id}`}
              title={product.title}
              price={price / 100}
              productId={product.id}
              size={size}
              src={product.picture}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
import type { GetServerSideProps } from "next";
import superjson from "superjson";
import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import { getServerAuthSession } from "../../server/auth";
import { appRouter } from "../../server/api/root.router";
import { createContextInner } from "../../server/api/trpc";
import { SIGNIN_ROUTE } from "@/utils/general/constants";

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

  await ssg.wishList.getWishList.prefetch();
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
