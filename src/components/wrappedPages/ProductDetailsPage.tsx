import { useMemo, useState } from "react";
import { RadioGroup } from "@headlessui/react";
import { AiOutlineStar } from "react-icons/ai";
import { PrintifyGetProductResponse } from "../../utils/printify/printifyTypes";
import { api } from "../../utils/api";
import { toast } from "react-toastify";
import Image from "next/image";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

type ProductPagePropTypes = {
  product: PrintifyGetProductResponse;
};
type OptionType = {
  quantity: number;
  size: number;
  variantId: number;
  cost: number;
};
const HomeNLivingTag = "Home & Living";
const isClothingType = (tags: string[]) =>
  tags.find((item) => item == HomeNLivingTag) === undefined;
export default function ProductDetailsPage({ product }: ProductPagePropTypes) {
  const { mutateAsync: addToCart, isLoading } =
    api.cart.addProductToCart.useMutation();

  const [options, setOptions] = useState<OptionType>({
    quantity: 1,
    size: product.options[1]?.values[0]?.id as number,
    variantId: product.variants[0]?.id as number,
    cost: product.variants[0]?.cost as number,
  });

  const handleAddToCart = async () => {
    try {
      await addToCart({
        productId: product.id,
        description: product.description,
        title: product.title,
        picture: product.images[0]?.src as string,
        size: options.size.toString(),
        variantId: options.variantId,
        quantity: options.quantity,
        price: options.cost / options.quantity,
      });
      toast.success("A product has been added to your cart");
    } catch (error) {
      toast.error(
        "There was an erorr. Product has not been added to your cart"
      );
      console.log(error);
    }
  };
  const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const quantity = parseInt(event.target.value);
    const originalCost = product.variants.find(
      (variant) => variant.id == options.variantId
    )?.cost as number;
    setOptions({
      ...options,
      quantity,
      cost: originalCost * quantity,
    });
  };

  const isClothing = useMemo(() => isClothingType(product.tags), []);
  const handleSizeChange = (id: number) => {
    const variant = product.variants.find((varItem) => {
      if (!isClothing) return varItem.options[0] == id;
      const defaultColorId = product?.options[0]?.values[0]?.id as number;
      return varItem.options[1] == id && varItem.options[0] == defaultColorId;
    });
    setOptions({
      ...options,
      size: id,
      cost: (variant?.cost as number) * options.quantity,
      variantId: variant?.id as number,
    });
  };

  return (
    <div className="bg-skin-main">
      <div className="pt-6">
        <nav aria-label="Breadcrumb">
          <ol
            role="list"
            className="mx-auto flex max-w-2xl items-center space-x-2 px-4 sm:px-6 lg:max-w-7xl lg:px-8"
          >
            <li className="text-sm">
              <a
                href={`/product/${product.id}`}
                aria-current="page"
                className="font-medium text-white hover:text-gray-200"
              >
                {product.title}
              </a>
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
                src={product.images?.[2]?.src || ""}
                alt={product.images?.[2]?.src || ""}
                className="h-full w-full object-cover object-center"
                fill
              />
            </div>
          </div>
          <div className="aspect-h-5 aspect-w-4 sm:overflow-hidden sm:rounded-lg lg:aspect-h-4 lg:aspect-w-3">
            <Image
              src={product.images?.[3]?.src || ""}
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
            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              {product.title}
            </h1>
          </div>

          {/* Options */}
          <div className="mt-4 lg:row-span-3 lg:mt-0">
            <h2 className="sr-only">Product information</h2>
            <p className="text-3xl tracking-tight text-white">
              {options.cost / 100} $
            </p>

            {/* Reviews */}
            {/* <div className="mt-6">
              <h3 className="sr-only">Reviews</h3>
              <div className="flex items-center">
                <div className="flex items-center">
                  {[0, 1, 2, 3, 4].map((rating) => (
                    <AiOutlineStar
                      key={rating}
                      className={classNames(
                        reviews.average > rating ? 'text-gray-900' : 'text-gray-200',
                        'h-5 w-5 flex-shrink-0'
                      )}
                      aria-hidden="true"
                    />
                  ))}
                </div>
                <p className="sr-only">{reviews.average} out of 5 stars</p>
                <a href={reviews.href} className="ml-3 text-sm font-medium text-indigo-600 hover:text-indigo-500">
                  {reviews.totalCount} reviews
                </a>
              </div>
            </div> */}

            <div className="mt-10">
              {/* Sizes */}
              <div className="flex flex-col">
                <label
                  htmlFor="quantity"
                  className="block text-lg font-medium text-gray-700"
                >
                  Quantity:
                </label>
                <input
                  type="number"
                  name="quantity"
                  min="1"
                  id="quantity"
                  value={options.quantity}
                  onChange={handleQuantityChange}
                  className="mt-2 h-10 w-16 rounded-md border-gray-300 bg-skin-secondary px-2 text-white 
                shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              <div className="mt-10">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-white">Size</h3>
                  <a
                    href="#"
                    className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    Size guide
                  </a>
                </div>

                <RadioGroup
                  value={options.size}
                  onChange={handleSizeChange}
                  className="mt-4"
                >
                  <RadioGroup.Label className="sr-only text-white">
                    Choose a size
                  </RadioGroup.Label>
                  <div className="grid grid-cols-4 gap-4 sm:grid-cols-8 lg:grid-cols-4">
                    {product.options
                      .find((item) => item.type == "size")
                      ?.values.map((option) => (
                        <RadioGroup.Option
                          key={option.id}
                          value={option.id}
                          // disabled={!size.inStock}
                          className={`ml-2 flex h-10 text-white ${
                            options.size == option.id
                              ? "border-indigo-500"
                              : null
                          }
                    items-center justify-center overflow-hidden ${
                      isClothing ? "w-16" : "w-36"
                    } group relative flex cursor-pointer items-center rounded-md border-2 bg-skin-secondary py-3 px-4 
                    text-sm font-medium uppercase duration-150 hover:bg-skin-light-secondary focus:outline-none sm:flex-1 
                    sm:py-6`}
                          onClick={() => handleSizeChange(option.id)}
                        >
                          <p
                            className={`text-lg ${
                              isClothing ? "whitespace-nowrap" : ""
                            }`}
                          >
                            {option.title}
                          </p>
                        </RadioGroup.Option>
                      ))}
                  </div>
                </RadioGroup>
              </div>

              <button
                type="submit"
                className="mt-10 flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                onClick={handleAddToCart}
              >
                Add to bag
              </button>
            </div>
          </div>

          <div className="py-10 lg:col-span-2 lg:col-start-1 lg:border-r lg:border-gray-200 lg:pb-16 lg:pr-8 lg:pt-6">
            {/* Description and details */}
            <div>
              <h3 className="sr-only">Description</h3>

              <div className="space-y-6">
                <p
                  className="text-base text-white"
                  dangerouslySetInnerHTML={{ __html: product.description }}
                ></p>
              </div>
            </div>

            <div className="mt-10">
              <h3 className="text-sm font-medium text-white">Highlights</h3>

              <div className="mt-4">
                <ul role="list" className="list-disc space-y-2 pl-4 text-sm">
                  {/* {product.highlights.map((highlight) => (
                    <li key={highlight} className="text-gray-400">
                      <span className="text-gray-600">{highlight}</span>
                    </li>
                  ))} */}
                </ul>
              </div>
            </div>

            <div className="mt-10">
              <h2 className="text-sm font-medium text-white">Details</h2>

              <div className="mt-4 space-y-6">
                {/* <p className="text-sm text-gray-600">{product.details}</p> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
