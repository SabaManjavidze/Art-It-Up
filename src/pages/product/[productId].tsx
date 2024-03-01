import { api } from "../../utils/api";
import { useEffect, useMemo } from "react";
import { Loader2 } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "react-toastify";
import Image from "next/image";
import Link from "next/link";
import { Label } from "@/components/ui/label";
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

  const [image, setImage] = useState(product?.images?.[0]?.src || "");
  const [showModal, setShowModal] = useState(false);
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
        price: options.cost,
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
  const handlePurchaseClick = async () => {
    router.push("/user/cart");
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
        styleId: "asstaenjlcxdrvrvwe9f",
        sizeId: options.size,
        sizeTitle: product.sizes.find((size) => size.id == options.size)
          ?.title as string,
        variantId: options.variantId,
        quantity: options.quantity,
        price: options.cost,
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
  const handleQuantityChange = (quantity: number) => {
    if (quantity < 1) return;
    setOptions({
      ...options,
      quantity,
    });
  };

  const handleSizeChange = (id: number) => {
    const variant = product?.sizes?.find((size) => {
      return size.id == id;
    });
    setOptions({
      ...options,
      size: id,
      cost: variant?.cost as number,
      variantId: variant?.id as number,
    });
  };
  const handleImageClick = (src: string) => {
    setImage(src);
  };
  return (
    <>
      <Head>
        <title>{product.title}</title>
        <meta
          property="og:image"
          content={product?.images?.[0]?.src as string}
        />
      </Head>
      <div className="container min-h-screen bg-background">
        {/* Product info */}
        <StyleUploadModal
          closeModal={() => setShowModal(false)}
          isOpen={showModal}
          product={product}
        />
        <div className="mt-12 flex min-h-[60vh] w-full flex-col justify-between lg:mt-28 lg:flex-row">
          <div className="flex w-full flex-col items-center lg:flex-row lg:pr-12">
            <Carousel
              autoPlay={false}
              className="flex h-full w-1/2 items-center border px-0"
            >
              {product.images.slice(0, 3).map((img) => (
                <div
                  className="relative h-[50vh] w-full rounded-3xl"
                  key={img.src}
                >
                  <Image
                    src={img.src || ""}
                    alt={"product image"}
                    sizes={SIZES_PROP}
                    className="h-full w-full rounded-3xl object-cover sm:object-contain lg:object-cover"
                    fill
                  />
                </div>
              ))}
            </Carousel>
            <div className="mt-10 flex h-full w-full flex-col justify-between lg:mt-0 lg:ml-4 lg:w-1/2 lg:items-start">
              <div className="flex items-start">
                <h1 className="text-2xl font-medium tracking-tight text-primary-foreground sm:text-4xl">
                  {product.title}
                </h1>
              </div>
              {/* Sizes */}
              <div className="mt-5 h-full lg:w-1/2">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-primary-foreground">
                    Sizes:
                  </h3>
                </div>
                <div
                  className={`grid ${
                    product.isClothe
                      ? "grid-cols-4 lg:grid-cols-3"
                      : "grid-cols-2 lg:grid-cols-2"
                  } mt-5 max-h-64 gap-y-3 gap-x-3 overflow-y-auto sm:grid-cols-4 lg:gap-x-0 `}
                >
                  {product.sizes.map((option) => (
                    <div key={option.id} className="flex w-full justify-center">
                      <Button
                        // disabled={!size.inStock}
                        variant={"outline"}
                        className={`flex border ${
                          options.size == option.id ? "border-indigo-500" : null
                        }
                    items-center justify-center overflow-hidden ${
                      product.isClothe ? "h-10 w-16" : "lg:h-16 lg:w-36"
                    }`}
                        onClick={() => handleSizeChange(option.id)}
                      >
                        <Label
                          className={`md:text-lg ${
                            product.isClothe ? "whitespace-nowrap" : ""
                          }`}
                        >
                          {option.title}
                        </Label>
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-10 flex h-full items-end px-5 text-xl lg:mt-0">
                <Button
                  variant={"outline"}
                  className={"h-28 w-36 rounded-2xl bg-muted"}
                  onClick={() => setShowModal(true)}
                >
                  <div className="flex w-full flex-col items-center">
                    <AiOutlineCloudUpload size={30} />
                    <Label className="whitespace-nowrap text-base">
                      Upload a photo
                    </Label>
                  </div>
                </Button>
              </div>
            </div>
          </div>

          {/* Options */}
          <div className="mt-4 lg:row-span-3 lg:mt-0 lg:w-1/5">
            <div className="flex w-full justify-between">
              <p className="text-3xl font-medium tracking-tight text-primary-foreground">
                ${(options.cost * options.quantity) / 100}
              </p>
              <div className="flex items-start">
                <Button
                  variant="outline"
                  className="rounded-r-none"
                  onClick={() => handleQuantityChange(options.quantity - 1)}
                >
                  -
                </Button>
                <div className="flex h-10 items-center justify-center border border-x-0 border-input px-4">
                  {options.quantity}
                </div>
                <Button
                  variant="outline"
                  className="rounded-l-none"
                  onClick={() => handleQuantityChange(options.quantity + 1)}
                >
                  +
                </Button>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex flex-col">
                <Button
                  type="submit"
                  variant={"accent"}
                  className="mt-3 rounded-3xl py-8 text-base"
                  onClick={handlePurchaseClick}
                >
                  <BsWalletFill className="w-[10%]" />
                  <h3 className="w-[90%]">Purchase</h3>
                </Button>
                <Button
                  type="submit"
                  variant={"destructive"}
                  className="mt-2 rounded-3xl py-8 text-base"
                  isLoading={addToWishListLoading}
                  onClick={handleAddToWishList}
                >
                  {product.isInWishList ? (
                    <>
                      <BsHeartFill className="w-[10%]" />
                      <h3 className="w-[90%] ">Remove From WishList</h3>
                    </>
                  ) : (
                    <>
                      <BsHeart className="w-[10%]" />
                      <h3 className="w-[90%] ">Add To WishList</h3>
                    </>
                  )}
                </Button>
                <Button
                  type="submit"
                  variant={"default"}
                  className="mt-2 rounded-3xl py-8 text-base"
                  onClick={handleAddToCart}
                  isLoading={addToCartLoading}
                >
                  {product.isInCart ? (
                    <>
                      <BsCart className="w-[10%]" />
                      <h3 className="w-[90%] ">Remove From Cart</h3>
                    </>
                  ) : (
                    <>
                      <BsCartFill className="w-[10%]" />
                      <h3 className="w-[90%] ">Add To Cart</h3>
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
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
import {
  SIGNIN_ROUTE,
  BLANK_PROFILE_URL,
  SIZES_PROP,
} from "@/utils/general/constants";
import { AiOutlineCloudUpload, AiOutlinePlusSquare } from "react-icons/ai";
import {
  BsCart,
  BsCartFill,
  BsChevronBarRight,
  BsHeart,
  BsHeartFill,
  BsWallet,
  BsWalletFill,
} from "react-icons/bs";
import { Carousel } from "@/components/ui/carousel";
import Head from "next/head";
import Modal from "@/components/ui/modal";
import ImageInput from "@/components/general/ImageInput";
import { StyleUploadModal } from "@/components/productPageComponents/StyleUploadModal";

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
