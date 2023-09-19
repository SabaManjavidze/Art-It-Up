import { api } from "../../utils/api";
import { useEffect, useMemo } from "react";
import { Loader2 } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "react-toastify";
import Image from "next/image";
import Link from "next/link";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type OptionType = {
  quantity: number;
  size: number;
  variantId: number;
  cost: number;
};

const ProductPageContainer = ({ productId }: { productId: string }) => {
  const { data: product, error } = api.product.getPrintifyProduct.useQuery({
    id: productId,
  });
  const utils = api.useContext();
  const { mutateAsync: addToCart, isLoading: addToCartLoading } =
    api.cart.addProductToCart.useMutation({
      onSuccess() {
        utils.product.getPrintifyProduct.invalidate();
      },
    });
  const { mutateAsync: addToWishList, isLoading: addToWishListLoading } =
    api.wishList.addProductToList.useMutation({
      onSuccess() {
        utils.product.getPrintifyProduct.invalidate();
      },
    });
  const session = useSession();
  const router = useRouter();
  const descRef = useRef<HTMLParagraphElement>(null);

  const [options, setOptions] = useState<OptionType>({
    quantity: 1,
    size: product?.sizes[0]?.id as number,
    variantId: product?.sizes[0]?.variantId as number,
    cost: product?.sizes[0]?.cost as number,
  });

  useEffect(() => {
    if (descRef?.current) {
      descRef.current.innerHTML = product?.description || "";
    }
  }, [descRef, product?.description]);

  if (error || !product) {
    return <h1>there was an error {JSON.stringify(error, null, 2)}</h1>;
  }
  const handleAddToWishList = async () => {
    if (session.status == "unauthenticated") {
      toast.error("Unauthenticated. click here to sign in", {
        onClick: () => router.push(SIGNIN_ROUTE),
      });
    }
    try {
      await addToWishList({
        productId: product.id,
        description: product.description,
        title: product.title,
        picture: product.images[0]?.src as string,
        sizeId: options.size,
        sizeTitle: product.sizes.find((size) => size.id == options.size)
          ?.title as string,
        variantId: options.variantId,
        price: options.cost / options.quantity,
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
  const handleAddToCart = async () => {
    if (session.status == "unauthenticated") {
      toast.error("Unauthenticated. click here to sign in", {
        onClick: () => router.push(SIGNIN_ROUTE),
      });
    }
    try {
      await addToCart({
        productId: product.id,
        styleId: "",
        sizeId: options.size,
        sizeTitle: product.sizes.find((size) => size.id == options.size)
          ?.title as string,
        variantId: options.variantId,
        quantity: options.quantity,
        price: options.cost / options.quantity,
        isInCart: product.isInCart,
      });
      if (product.isInCart) {
        toast.info("Removed product from your cart");
      } else {
        toast.success("A product has been added to your cart");
      }
    } catch (error) {
      toast.error(error as string);
    }
  };
  const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const quantity = parseInt(event.target.value);
    const originalCost = product.sizes.find(
      (size) => size.variantId == options.variantId
    )?.cost as number;
    setOptions({
      ...options,
      quantity,
      cost: originalCost * quantity,
    });
  };

  const handleSizeChange = (id: string) => {
    const intId = parseInt(id);
    const variant = product?.sizes?.find((size) => {
      return size.id == intId;
    });
    setOptions({
      ...options,
      size: intId,
      cost: (variant?.cost as number) * options.quantity,
      variantId: variant?.id as number,
    });
  };

  return (
    <div className="bg-background">
      <div className="pt-6">
        <nav>
          <ol
            role="list"
            className="mx-auto flex max-w-2xl items-center space-x-2 px-4 sm:px-6 lg:max-w-7xl lg:px-8"
          >
            <li className="text-sm">
              <Link
                href={`/product/${product.id}`}
                aria-current="page"
                className="font-medium text-primary-foreground hover:text-gray-200"
              >
                {product.title}
              </Link>
            </li>
          </ol>
        </nav>

        {/* Image gallery */}
        <div className="mx-auto mt-6 max-w-2xl sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:gap-x-8 lg:px-8">
          <div className="aspect-h-4 aspect-w-3 hidden overflow-hidden rounded-lg lg:block">
            <Image
              src={product.images?.[0]?.src || ""}
              alt={product.images?.[0]?.src || ""}
              className="h-full w-full object-cover object-center"
              fill
            />
          </div>
          <div className="hidden lg:grid lg:grid-cols-1 lg:gap-y-8">
            <div className="aspect-h-2 aspect-w-3 overflow-hidden rounded-lg">
              <Image
                src={product.images?.[1]?.src || ""}
                alt={product.images?.[1]?.src || ""}
                fill
                className="h-full w-full object-cover object-center"
              />
            </div>
            <div className="aspect-h-2 aspect-w-3 overflow-hidden rounded-lg">
              <Image
                src={product.images?.[2]?.src || product.images?.[1]?.src || ""}
                alt={product.images?.[2]?.src || ""}
                className="h-full w-full object-cover object-center"
                fill
              />
            </div>
          </div>
          <div className="aspect-h-5 aspect-w-4 sm:overflow-hidden sm:rounded-lg lg:aspect-h-4 lg:aspect-w-3">
            <Image
              src={product.images?.[3]?.src || product.images?.[0]?.src || ""}
              alt={product.images?.[3]?.src || ""}
              className="h-full w-full object-cover object-center"
              fill
            />
          </div>
        </div>

        {/* Product info */}
        <div
          className="mx-auto max-w-2xl px-4 pb-16 pt-10 sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 
        lg:grid-rows-[auto,auto,1fr] lg:gap-x-8 lg:px-8 lg:pb-24 lg:pt-16"
        >
          <div className="lg:col-span-2 lg:border-r lg:border-gray-200 lg:pr-8">
            <h1 className="text-2xl font-bold tracking-tight text-primary-foreground sm:text-3xl">
              {product.title}
            </h1>
          </div>

          {/* Options */}
          <div className="mt-4 lg:row-span-3 lg:mt-0">
            <h2 className="sr-only">Product information</h2>
            <p className="text-3xl tracking-tight text-primary-foreground">
              {options.cost / 100} $
            </p>
            <div className="mt-10">
              <div className="flex flex-col">
                <label
                  htmlFor="quantity"
                  className="block text-lg font-medium text-gray-700"
                >
                  Quantity:
                </label>
                <Input
                  type="number"
                  name="quantity"
                  min="1"
                  id="quantity"
                  value={options.quantity}
                  onChange={handleQuantityChange}
                  className="mt-2 h-10 w-16 rounded-md border-gray-300 px-2 text-primary-foreground 
                shadow-sm duration-150 focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              {/* Sizes */}
              <div className="mt-10">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-primary-foreground">
                    Size
                  </h3>
                </div>

                <Label className="sr-only text-primary-foreground">
                  Choose a size
                </Label>
                <div
                  className={`grid ${product.isClothe
                      ? "grid-cols-4 lg:grid-cols-2"
                      : "grid-cols-2 lg:grid-cols-2"
                    } mt-5 max-h-64 gap-3 gap-x-0 overflow-y-auto sm:grid-cols-4 `}
                >
                  {product.sizes.map((option) => (
                    <div key={option.id} className="flex w-full justify-center">
                      <Button
                        // disabled={!size.inStock}
                        className={`flex border-2 text-primary-foreground ${options.size == option.id ? "border-indigo-500" : null
                          }
                    items-center justify-center overflow-hidden ${product.isClothe ? "h-10 w-16" : "h-16 w-36"
                          }`}
                        onClick={() => handleSizeChange(option.id.toString())}
                      >
                        <Label
                          className={`text-lg text-secondary-foreground ${product.isClothe ? "whitespace-nowrap" : ""
                            }`}
                        >
                          {option.title}
                        </Label>
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-10 flex flex-col">
                <Button
                  type="submit"
                  variant={"destructive"}
                  className="mt-5 text-base"
                  isLoading={addToWishListLoading}
                  onClick={handleAddToWishList}
                >
                  {product.isInWishList
                    ? "Remove Product From WishList"
                    : "Add To WishList"}
                </Button>
                <Button
                  type="submit"
                  variant={"secondary"}
                  className="mt-5 text-base"
                  onClick={handleAddToCart}
                  isLoading={addToCartLoading}
                >
                  {product.isInCart
                    ? "Remove Product From Cart"
                    : "Add To Cart"}
                </Button>
              </div>
            </div>
          </div>

          <div className="py-10 lg:col-span-2 lg:col-start-1 lg:border-r lg:border-gray-200 lg:pb-16 lg:pr-8 lg:pt-6">
            {/* Description and details */}
            <div>
              <h3 className="sr-only">Description</h3>

              <div className="space-y-6">
                <p
                  className="text-base text-primary-foreground"
                  ref={descRef}
                ></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPageContainer;

import type { GetServerSideProps } from "next";
import superjson from "superjson";
import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import { getServerAuthSession } from "../../server/auth";
import { appRouter } from "../../server/api/root.router";
import { createContextInner } from "../../server/api/trpc";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { SIGNIN_ROUTE, BLANK_PROFILE_URL } from "@/utils/constants";
import { AiOutlinePlusSquare } from "react-icons/ai";

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

  const productId = context?.params?.productId as string;
  await ssg.product.getPrintifyProduct.prefetch({ id: productId });
  return {
    props: {
      trpcState: ssg.dehydrate(),
      productId,
    },
  };
};
