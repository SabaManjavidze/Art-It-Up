import React, { useEffect, useState } from "react";
import { api } from "../../utils/api";
import { Loader2 } from "lucide-react";
import { PaginationProvider } from "@/hooks/usePaginationHook";
import { ResultProductList } from "./ResultProductList";

type SearchResultsPagePropType = {
  query: string;
  tags?: string[];
};
const limit = 10;
export const SearchResultsPage = ({
  query,
  tags,
}: SearchResultsPagePropType) => {
  const {
    data,
    isFetching: productsLoading,
    isLoading,
    error,
    fetchNextPage,
  } = api.product.searchProducts.useInfiniteQuery(
    {
      name: query,
      tags,
      limit,
    },
    { getNextPageParam: (lastPage) => lastPage.nextCursor }
  );
  if (data?.pages[0]?.products.length == 0)
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <h2 className="text-3xl">0 Results Found For "{query}"</h2>
      </div>
    );
  return (
    <div className="container-xl min-h-screen bg-background px-16 xl:px-0">
      {!isLoading && !error ? (
        <PaginationProvider
          pagesData={data?.pages}
          fetchNextPage={fetchNextPage}
        >
          <ResultProductList data={data} />
        </PaginationProvider>
      ) : (
        <div className="flex h-screen items-center justify-center bg-background">
          <Loader2 size={15} />
        </div>
      )}
    </div>
  );
};
