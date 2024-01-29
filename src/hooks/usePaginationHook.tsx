import type { Dispatch, ReactNode, SetStateAction } from "react";
import React, { createContext, useContext, useEffect, useState } from "react";
import type { SearchType } from "@/components/ui/SearchTypeDropDown";
import { Button } from "@/components/ui/button";

type PaginationContextProps = {
  page: number;
};
export const PaginationContext = createContext<PaginationContextProps>({
  page: 0,
});
export const usePagination = () => useContext(PaginationContext);

export const PaginationProvider = ({
  pagesData,
  children,
  fetchNextPage,
}: {
  children: ReactNode;
  pagesData: (any & { nextCursor: string })[];
  fetchNextPage: () => Promise<any>;
}) => {
  const [page, setPage] = useState(0);

  useEffect(() => {
    if (pagesData[0]?.nextCursor) {
      fetchNextPage();
    }
  }, []);

  const handlePageClick = async (nextPage: number) => {
    setPage(nextPage);
    window.scrollTo(0, 0);
    const lastPage = pagesData.length;
    if (nextPage == lastPage && pagesData[nextPage - 1]?.nextCursor) {
      await fetchNextPage();
    }
  };
  return (
    <PaginationContext.Provider
      value={{
        page,
      }}
    >
      {children}
      <div className="flex justify-center">
        <div className="flex w-1/3 items-center justify-center">
          {[
            ...new Array(
              pagesData[pagesData.length - 1]?.nextCursor
                ? pagesData.length + 1
                : pagesData.length
            ).keys(),
          ].map((item) => (
            <Button
              variant={item == page ? "default" : "outline"}
              key={item}
              onClick={async () => await handlePageClick(item)}
              className="mx-3 first-of-type:mx-0"
            >
              {item + 1}
            </Button>
          ))}
        </div>
      </div>
    </PaginationContext.Provider>
  );
};
