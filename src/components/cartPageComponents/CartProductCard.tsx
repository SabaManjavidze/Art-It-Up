import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useCheckout } from "../../hooks/useCheckoutHooks";
import { api } from "../../utils/api";
import { Loader2 } from "lucide-react";
import { IoCloseCircle, IoCloseOutline } from "react-icons/io5";
import type { SearchType } from "../ui/SearchTypeDropDown";
import SearchTypeDropDown from "../ui/SearchTypeDropDown";
import { limitTxt } from "@/utils/general/utils";
import { Button } from "../ui/button";

type CategoryCardPropType = {
  href: string;
  title: string;
  description: string;
  price: number;
  src: string;
  size: { id: number; title: string };
  quantity: number;
  productId: string;
};
const CartProductCard = ({
  href,
  title,
  src,
  description,
  price,
  quantity,
  productId,
  size,
}: CategoryCardPropType) => {
  const {
    handleChangeSize,
    handleChangeQuantity,
    selected,
    setSelected,
    setValuesChanged,
  } = useCheckout();
  const utils = api.useContext();

  const { mutateAsync: removeCartProduct, isLoading: removeProductLoading } =
    api.cart.removeProductFromCart.useMutation({
      onSuccess() {
        utils.cart.getCart.invalidate();
      },
    });
  const {
    mutateAsync: getSizes,
    isLoading: sizesLoading,
    data: sizes,
  } = api.product.getPrintifyProductSizes.useMutation();

  const [selectedSize, setSize] = useState<SearchType>({
    id: size.id.toString(),
    title: size.title,
  });
  const [isOpen, setIsOpen] = useState(false);
  const handleRemoveCartProduct = async (prodId: string) => {
    setSelected(selected.filter((id) => id !== prodId));
    setValuesChanged(true);
    await removeCartProduct({ productId: prodId });
  };
  const handleOpenClick = async () => {
    if (!isOpen) {
      await getSizes({ id: productId });
    }
    setIsOpen(true);
  };

  return (
    <div className="relative justify-between rounded-lg bg-white p-6 shadow-lg sm:flex sm:justify-start">
      <button
        className="absolute top-2 right-2 block cursor-pointer pr-5 text-xs leading-3 text-red-500 underline duration-150 hover:scale-105 sm:hidden"
        onClick={() => handleRemoveCartProduct(productId)}
        title="Remove Product"
      >
        {removeProductLoading ? (
          <Loader2 />
        ) : (
          <IoCloseOutline size={30} className="text-red-500" />
        )}
      </button>
      <div className="relative mt-4 h-52 w-full rounded-xl border-2 border-primary/30 sm:w-4/12 lg:mt-0 2xl:w-1/4">
        <Link href={href}>
          <Image
            src={src}
            fill
            alt={title}
            className="h-full object-contain object-center md:object-contain"
          />
        </Link>
      </div>
      <div className="ml-4 flex w-full flex-col items-start sm:flex-row sm:justify-between">
        <div className="mt-5 sm:mt-0">
          <h2 className="text-lg font-bold text-gray-900">
            {limitTxt(title, 25)}
          </h2>
          <SearchTypeDropDown
            responsive={false}
            selected={selectedSize}
            handleSelectItem={handleSelectItem()}
            isLoading={sizesLoading}
            handleOpenClick={handleOpenClick}
            className="mt-2"
            options={
              sizes?.map((item) => {
                return {
                  id: item.id,
                  title: item.title,
                };
              }) as any
            }
          />
          <h2 className="mt-2">$ {price}</h2>
        </div>
        <div className="flex items-start">
          <Button
            variant="outline"
            className="rounded-r-none"
            onClick={() => handleChangeQuantity(productId, quantity - 1)}
          >
            -
          </Button>
          <div className="flex h-10 items-center justify-center border border-x-0 border-input px-4">
            {quantity}
          </div>
          <Button
            variant="outline"
            className="rounded-l-none"
            onClick={() => handleChangeQuantity(productId, quantity + 1)}
          >
            +
          </Button>
        </div>
        <button
          className="hidden cursor-pointer pr-5 text-xs leading-3 text-red-500 underline duration-150 hover:scale-105 sm:block"
          onClick={() => handleRemoveCartProduct(productId)}
          title="Remove Product"
        >
          {removeProductLoading ? (
            <Loader2 />
          ) : (
            <IoCloseOutline size={30} className="text-red-500" />
          )}
        </button>
      </div>
    </div>
  );

  function handleSelectItem(): (option: SearchType) => void {
    return (option) => {
      setSize(option);
      const item = sizes?.find((item) => {
        return item.id.toString() == option.id;
      });
      const cost = item?.cost as number;
      handleChangeSize(productId, cost);
    };
  }
};
export default CartProductCard;
