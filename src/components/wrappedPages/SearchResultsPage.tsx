import React, { useEffect, useState } from "react";
import type { RouterOutputs } from "../../utils/api";
import { api } from "../../utils/api";
import Image from "next/image";
import Link from "next/link";
import { FiHeart } from "react-icons/fi";
import { Button } from "../ui/button";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import { SIGNIN_ROUTE, SIZES_PROP } from "@/utils/general/constants";
import { useRouter } from "next/router";
import { Loader2 } from "lucide-react";
import { limitTxt } from "@/utils/utils";

type SearchResultsPagePropType = {
  query: string;
  tags?: string[];
};
const limit = 5;
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
  const [page, setPage] = useState(0);
  const [pages, setPages] = useState([1]);

  useEffect(() => {
    if (!isLoading && data?.pages[0]?.nextCursor) {
      setPages([1, 2]);
    }
  }, [isLoading]);
  const handlePageClick = async (nextPage: number) => {
    setPage(nextPage);
    window.scrollTo(0, 0);
    const lastPage = Number(pages?.[pages.length - 1]) - 1;
    if (nextPage == lastPage) {
      await fetchNextPage();
      if (data?.pages?.[nextPage]?.nextCursor)
        setPages([...pages, nextPage + 2]);
    }
  };
  if (data?.pages[page]?.products.length == 0)
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <h2 className="text-3xl">0 Results Found For "{query}"</h2>
      </div>
    );
  return (
    <div className="container-xl min-h-screen bg-background px-16 xl:px-0">
      {!productsLoading ? (
        data?.pages[page]?.products.map((product) => (
          <ResultProductCard key={product.id} product={product} />
        ))
      ) : (
        <div className="flex h-screen items-center justify-center bg-background">
          <Loader2 size={15} />
        </div>
      )}
      <div className="flex justify-center">
        <div className="flex w-1/3 items-center justify-center">
          {pages.map((item) => (
            <Button
              variant={item - 1 == page ? "default" : "outline"}
              key={item}
              onClick={() => handlePageClick(item - 1)}
              className="mx-3 first-of-type:mx-0"
            >
              {item}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};
function ResultProductCard({
  product,
}: {
  product: RouterOutputs["product"]["searchProducts"]["products"][number];
}) {
  const utils = api.useContext();
  const { mutateAsync: addToWishList, isLoading: addToWishListLoading } =
    api.wishList.addProductToList.useMutation({
      onSuccess() {
        utils.product.searchProducts.invalidate();
      },
    });
  const session = useSession();
  const router = useRouter();
  const handleAddToWishList = async (
    product: RouterOutputs["product"]["searchProducts"]["products"][number]
  ) => {
    if (session.status == "unauthenticated") {
      toast.error("Unauthenticated. click here to sign in", {
        onClick: () => router.push(SIGNIN_ROUTE),
      });
    }
    try {
      const [defSizeId, sizeTitle] = product.defautlSize.split(":");
      const sizeId = Number(defSizeId);
      if (!sizeId || !sizeTitle) return;
      await addToWishList({
        productId: product.id,
        description: product.description,
        title: product.title,
        picture: product.picture,
        sizeId,
        sizeTitle,
        variantId: product.defaultVariantId,
        price: product.defaultPrice,
        isInWishList: product.isInWishList,
      });
      if (product.isInWishList) {
        toast.info("Removed Product From Your WishList");
      } else {
        toast.success("Product has been added to your WishList");
      }
    } catch (error) {
      toast.error(error as string);
    }
  };
  return (
    <div className="my-16 flex h-64 flex-col items-center justify-center rounded-lg border md:flex-row md:items-stretch">
      <Link
        href={`/product/${product.id}`}
        className="relative flex w-full flex-1 items-center border-r border-gray-200
              bg-white shadow duration-150 hover:bg-gray-100 md:w-1/3"
      >
        <div className="relative h-full w-full">
          <Image
            className="h-96 w-full rounded-t-lg object-contain md:h-auto md:w-48 md:rounded-none md:rounded-l-lg"
            fill
            sizes={SIZES_PROP}
            src={product.picture}
            alt={product.picture}
          />
        </div>
      </Link>
      <div className="flex w-full flex-col justify-between p-4 leading-normal md:w-2/3">
        <div className="flex w-full items-center justify-between px-3 pb-2 md:border-b md:px-0">
          <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-primary-foreground">
            {limitTxt(product.title, 20)}
          </h5>
          <button
            onClick={() => handleAddToWishList(product)}
            className={`mr-4 duration-700 ${
              addToWishListLoading ? "animate-ping" : ""
            }`}
          >
            <FiHeart
              size={20}
              className={`duration-150 ${
                product.isInWishList ? "fill-red-500 text-red-500" : ""
              } hover:fill-red-500 hover:text-red-500`}
            />
          </button>
        </div>
        <p
          dangerouslySetInnerHTML={{ __html: product.description }}
          className="my-3 hidden h-4/5 overflow-y-auto font-normal text-gray-700 dark:text-gray-400 md:block"
        ></p>
      </div>
    </div>
  );
}
