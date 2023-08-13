import WishProductCard from "@/components/WishListPageComponents/WishProductCard";
import { api } from "@/utils/api";
import React, { useEffect, useState } from "react";

export default function index() {
  const {
    data: products,
    isLoading,
    error,
  } = api.wishList.getWishList.useQuery();

  if (isLoading) return <h1>loading...</h1>;
  if (error) return <h1>error</h1>;

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
        <div className=" mt-10 grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-2 lg:mt-12 lg:grid-cols-3 lg:gap-y-0">
          {products.map(({ product, price, size }) => (
            <WishProductCard
              description={product.description}
              href={`/product/${product.id}`}
              title={product.title}
              price={price}
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
