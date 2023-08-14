import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { api } from "../../utils/api";
import { Loader2 } from "lucide-react";
import { IoCloseCircle } from "react-icons/io5";
import { Button } from "../ui/button";

interface WishProductCardPropType {
  title: string;
  href: string;
  src: string;
  productId: string;
  size: string;
  description: string;
  price: number;
}
const MIN_TITLE_LENGTH = 25;
const WishProductCard = ({
  href,
  title,
  src,
  productId,
  size,
  price,
}: WishProductCardPropType) => {
  const utils = api.useContext();

  const {
    mutateAsync: removeWishListProduct,
    isLoading: removeProductLoading,
  } = api.wishList.removeProductFromList.useMutation({
    onSuccess() {
      utils.wishList.getWishList.invalidate();
    },
  });
  const { mutateAsync: moveToCart, isLoading: moveToCartLoading } =
    api.wishList.moveProductToCart.useMutation({
      onSuccess() {
        utils.wishList.getWishList.invalidate();
      },
    });
  const [show, setShow] = useState(false);

  const handleMoveToCart = async () => {
    await moveToCart({ productId });
  };
  const handleRemoveCartProduct = async () => {
    await removeWishListProduct({ productId });
  };
  return (
    <div className="flex flex-col">
      <div className="relative h-64 w-full xl:h-96 xl:w-96 ">
        <Link href={href}>
          <Image
            fill
            className="h-full border object-contain object-center"
            src={src}
            alt={src}
          />
        </Link>
        <button
          aria-label="close"
          onClick={handleRemoveCartProduct}
          className="absolute top-4 right-4 bg-gray-800 p-1.5 text-white hover:text-gray-400  focus:outline-none focus:ring-2 focus:ring-gray-800 focus:ring-offset-2"
        >
          {removeProductLoading ? (
            <Loader2 size={14} />
          ) : (
            <svg
              className="fil-current"
              width={14}
              height={14}
              viewBox="0 0 14 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M13 1L1 13"
                stroke="currentColor"
                strokeWidth="1.25"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M1 1L13 13"
                stroke="currentColor"
                strokeWidth="1.25"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </button>
      </div>
      <div className="mt-6 flex items-center justify-between">
        <div className="flex items-center justify-center">
          <p className="pr-4 text-2xl font-semibold leading-6 tracking-tight text-gray-800">
            {title.length > MIN_TITLE_LENGTH
              ? `${title.slice(0, MIN_TITLE_LENGTH)}...`
              : title}
          </p>
        </div>
        <div className="flex items-center justify-center">
          <button
            aria-label="show menu"
            onClick={() => setShow(!show)}
            className="bg-gray-800 py-2.5  px-2 text-white hover:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:ring-offset-2"
          >
            <svg
              className={`fill-stroke ${show ? "block" : "hidden"}`}
              width={10}
              height={6}
              viewBox="0 0 10 6"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9 5L5 1L1 5"
                stroke="currentColor"
                strokeWidth="1.25"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <svg
              className={`fill-stroke ${show ? "hidden" : "block"}`}
              width={10}
              height={6}
              viewBox="0 0 10 6"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1 1L5 5L9 1"
                stroke="currentColor"
                strokeWidth="1.25"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
      <div
        className={`jusitfy-start mt-12 flex-col items-start ${
          show ? "flex" : "hidden"
        }`}
      >
        <div></div>
        <div className="mt-6">
          <p className="text-base font-medium leading-4 tracking-tight text-gray-800">
            Size: {size.split(":")[1]}
          </p>
        </div>
        <div className="mt-6">
          <p className="text-base font-medium leading-4 tracking-tight text-gray-800">
            ${price}
          </p>
        </div>
        <Button
          isLoading={moveToCartLoading}
          onClick={handleMoveToCart}
          className="mt-5 w-full"
        >
          Add To Cart
        </Button>
      </div>
    </div>
  );
};
export default WishProductCard;
