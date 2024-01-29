import type { RouterOutputs } from "@/utils/api";
import type { InfiniteData } from "@tanstack/react-query";
import { ResultProductCard } from "../resultsPageComponents/ResultProductCard";
import { usePagination } from "@/hooks/usePaginationHook";

export function ResultProductList({
  data,
}: {
  data: InfiniteData<RouterOutputs["product"]["searchProducts"]>;
}) {
  const { page } = usePagination();
  return (
    (
      <>
        {data.pages[page]?.products.map((product) => (
          <ResultProductCard key={product.id} product={product} />
        ))}
      </>
    ) || (
      <div className="flex h-screen items-center justify-center bg-background">
        <h2 className="text-3xl">0 Results Found</h2>
      </div>
    )
  );
}
