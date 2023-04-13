import React from "react";
import { api } from "../../utils/api";
import Image from "next/image";

type SearchResultsPagePropType = {
  query: string;
  tags?: string[];
};
export const SearchResultsPage = ({
  query,
  tags,
}: SearchResultsPagePropType) => {
  const { data: products, isLoading: productsLoading } =
    api.printify.searchProducts.useQuery({ name: query, tags });
  return (
    <div className="absolute min-h-screen bg-skin-main">
      {products
        ? products.map((product) => (
            <a
              key={product.id}
              href={`/product/${product.id}`}
              className="m-16 flex flex-col items-center rounded-lg border border-gray-200 
              bg-white shadow hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800
              dark:hover:bg-gray-700 md:flex-row"
            >
              <div className="relative h-96 w-full">
                <Image
                  className="h-96 w-full rounded-t-lg object-cover md:h-auto md:w-48 md:rounded-none md:rounded-l-lg"
                  fill
                  src={product.picture}
                  alt=""
                />
              </div>
              <div className="flex flex-col justify-between p-4 leading-normal">
                <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                  {product.title}
                </h5>
                <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                  {product.description}
                </p>
              </div>
            </a>
          ))
        : null}
    </div>
  );
};
