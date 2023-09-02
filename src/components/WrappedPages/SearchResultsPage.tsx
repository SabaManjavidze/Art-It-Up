import React from "react";
import type { RouterOutputs} from "../../utils/api";
import { api } from "../../utils/api";
import Image from "next/image";
import Link from "next/link";
import { FiHeart } from "react-icons/fi";
import { Button } from "../ui/button";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import { SIGNIN_ROUTE } from "@/utils/constants";
import { PrintifyGetProductResponse } from "@/utils/printify/printifyTypes";
import { useRouter } from "next/router";

type SearchResultsPagePropType = {
  query: string;
  tags?: string[];
};
export const SearchResultsPage = ({
  query,
  tags,
}: SearchResultsPagePropType) => {
  const { data: products, isLoading: productsLoading } =
    api.product.searchProducts.useQuery({ name: query, tags });

  return (
    <div className="min-h-screen bg-background">
      {products
        ? products.map((product) => (
            <ResultProductCard key={product.id} product={product} />
          ))
        : null}
    </div>
  );
};
function ResultProductCard({
  product,
}: {
  product: RouterOutputs["product"]["searchProducts"][number];
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
    product: RouterOutputs["product"]["searchProducts"][number]
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
    <div className="container-xl my-16 flex h-64 justify-center rounded-lg border ">
      <Link
        href={`/product/${product.id}`}
        className="flex w-1/3 items-center border-r border-gray-200
              bg-white shadow duration-150 hover:bg-gray-100"
      >
        <div className="relative h-full w-full">
          <Image
            className="h-96 w-full rounded-t-lg object-contain md:h-auto md:w-48 md:rounded-none md:rounded-l-lg"
            fill
            src={product.picture}
            alt={product.picture}
          />
        </div>
      </Link>
      <div className="flex max-h-[100%] w-2/3 flex-col justify-between p-4 leading-normal">
        <div className="flex w-full items-center justify-between border-b pb-2">
          <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-primary-foreground">
            {product.title}
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
          className="my-3 h-4/5 overflow-y-auto font-normal text-gray-700 dark:text-gray-400"
        ></p>
      </div>
    </div>
  );
}
