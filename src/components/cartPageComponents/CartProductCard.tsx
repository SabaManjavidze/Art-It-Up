import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useCheckout } from "../../hooks/useCheckoutHooks";
import { api } from "../../utils/api";
import { Loader2 } from "lucide-react";
import { IoCloseCircle } from "react-icons/io5";
import type { SearchType } from "../ui/SearchTypeDropDown";
import SearchTypeDropDown from "../ui/SearchTypeDropDown";
import { Input } from "@/components/ui/input";
import { nanoid } from "nanoid";

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
  const descRef = useRef<HTMLParagraphElement>(null);
  useEffect(() => {
    if (descRef?.current) {
      descRef.current.innerHTML = description;
    }
  }, [descRef]);
  return (
    <div className="items-strech border-b border-primary/20 py-8 md:flex md:py-10 lg:py-8">
      <div className="relative h-72 w-full border-2 border-primary/30 md:w-4/12 2xl:w-1/4">
        <Link href={href}>
          <Image
            src={src}
            fill
            alt={title}
            className="h-full object-contain object-center md:object-cover"
          />
        </Link>
      </div>
      <div className="flex flex-col justify-center md:w-8/12 md:pl-3 2xl:w-3/4">
        <div className="flex w-full items-center justify-between pt-1">
          <p className="text-xl font-black leading-none text-gray-800 dark:text-primary-foreground">
            {title}
          </p>
          <button
            className="cursor-pointer pr-5 text-xs leading-3 text-red-500 underline duration-150 hover:scale-105"
            onClick={() => handleRemoveCartProduct(productId)}
            title="Remove Product"
          >
            {removeProductLoading ? (
              <Loader2 color="white" />
            ) : (
              <IoCloseCircle size={30} className="text-red-500" />
            )}
          </button>
        </div>
        <div className="flex items-center py-4 text-lg">
          <p className="leading-3 text-gray-600">Size:</p>
          <p className="fontb-old ml-2">{selectedSize.title}</p>
        </div>
        <p
          ref={descRef}
          className="text-md mt-4 hidden w-3/4 leading-5 text-gray-600 dark:text-primary-foreground md:block"
        ></p>
        <div className="flex items-center justify-between pt-5">
          <div className="flex w-3/5 flex-col items-center justify-center sm:flex-row">
            <div className="flex w-full items-center">
              <Input
                className="w-12 border py-2 px-1 pr-3 text-center outline-none"
                value={quantity}
                type="number"
                min="1"
                max="50"
                onChange={(e) => {
                  handleChangeQuantity(
                    productId,
                    parseInt(e.currentTarget.value)
                  );
                }}
              />
              <p className="ml-4 text-lg leading-none text-gray-800 sm:ml-0">
                Quantity
              </p>
            </div>
            <div className="mt-2 flex w-full items-center sm:mt-0">
              <SearchTypeDropDown
                selected={selectedSize}
                handleSelectItem={handleSelectItem()}
                isLoading={sizesLoading}
                handleOpenClick={handleOpenClick}
                options={
                  sizes?.map((item) => {
                    return {
                      id: item.id,
                      title: item.title,
                    };
                  }) as any
                }
              />
              <p className="ml-4 text-lg leading-none text-gray-800">Size</p>
            </div>
          </div>
          <p className="text-base font-black leading-none text-gray-800 dark:text-primary-foreground">
            ${quantity * price}
          </p>
        </div>
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