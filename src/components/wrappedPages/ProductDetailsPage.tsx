import { useState } from "react";
import Image from "next/image";
import { api } from "../../utils/api";
import { PrintifyGetProductResponse } from "../../utils/printify/printifyTypes";

type ProductPagePropTypes = {
  product: PrintifyGetProductResponse;
};
const ProductPage = ({ product }: ProductPagePropTypes) => {
  const { mutateAsync: addToCart, isSuccess } =
    api.cart.addProductToCart.useMutation();
  const [options, setOptions] = useState<{
    quantity: number;
    size: number;
    variantId: number;
  }>({
    quantity: 1,
    size: product.options[1]?.values[0]?.id as number,
    variantId: product.variants[0]?.id as number,
  });
  const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setOptions({ ...options, quantity: parseInt(event.target.value) });
  };
  const handleAddToCart = async () => {
    await addToCart({
      productId: product.id,
      description: product.description,
      title: product.title,
      picture: product.images[0]?.src as string,
      ...options,
      size: product.options[1]?.values?.find((item) => item.id == options.size)
        ?.title as string,
    });
  };
  return (
    <div className="min-h-screen w-full bg-skin-main text-white">
      <div className="container mx-auto py-10">
        <div className="flex flex-col lg:flex-row">
          <div className="relative h-[400px] w-full lg:ml-10">
            <Image
              src={product.images[0]?.src as string}
              alt={product.title}
              className="object-cover"
              fill
              sizes="(max-width: 768px) 100vw,
              (max-width: 1200px) 50vw,
              33vw"
              priority
            />
          </div>
          <div className="w-full px-16 md:px-6 lg:ml-16">
            <h1 className="text-3xl font-bold">{product.title}</h1>
            <p className="text-lg text-gray-500">
              {product.description.replace(/(<([^>]+)>)/gi, "")}
            </p>
            <div className="mt-6 flex items-center">
              <span className="text-2xl font-bold">
                ${(product.variants[0]?.cost as number) / 100}
              </span>
              <span className="ml-4 text-gray-500">In stock</span>
            </div>
            <div className="mt-6 flex">
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
                  id="quantity"
                  value={options.quantity}
                  onChange={handleQuantityChange}
                  className="mt-2 h-10 w-16 rounded-md border-gray-300 bg-skin-secondary px-2 text-white 
                shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              <div className="ml-5 flex flex-col justify-between">
                <label
                  htmlFor="colors"
                  className="block text-lg font-medium text-gray-700"
                >
                  Sizes:
                </label>
                <div className="mt-2 grid grid-cols-4 grid-rows-2 gap-y-4 md:grid-cols-7 lg:grid-cols-2 xl:grid-cols-6">
                  {product.options[1]?.values.map((option) => (
                    <button
                      key={option.id}
                      className={`ml-2 flex h-10 w-10 ${
                        options.size == option.id
                          ? "border-2  border-white"
                          : null
                      }
                    items-center justify-center overflow-hidden rounded-full bg-skin-secondary `}
                      onClick={() =>
                        setOptions({ ...options, size: option.id })
                      }
                    >
                      <p className="text-lg">{option.title}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <button
              className="mt-6 rounded-md bg-black py-3 px-4 text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75"
              onClick={handleAddToCart}
            >
              Add to cart
            </button>
            <div className="flex w-full items-center justify-center"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
