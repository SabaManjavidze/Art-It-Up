import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { api } from "../utils/api";
import { loadScript, PayPalNamespace } from "@paypal/paypal-js";
import { PrintifyGetProductResponse } from "../utils/printify/printifyTypes";

const loadPaypal = async (id: string, price: number | string) => {
  let paypal: PayPalNamespace | null = null;

  try {
    paypal = await loadScript({
      "client-id": process.env.PAYPAL_CLIENT_ID as string,
    });
  } catch (error) {
    console.error("failed to load the PayPal JS SDK script", error);
  }

  if (paypal) {
    try {
      await paypal
        .Buttons?.({
          createOrder: async function (data, actions) {
            return actions.order.create({
              purchase_units: [
                {
                  amount: {
                    value: price.toString(),
                  },
                },
              ],
            });
          },
        })
        .render(id);
    } catch (error) {
      console.error("failed to render the PayPal Buttons", error);
    }
  }
};

type ProductPagePropTypes = {
  product: PrintifyGetProductResponse;
};
const ProductPage = ({ product }: ProductPagePropTypes) => {
  const { mutateAsync: addToCart } = api.user.addProductToCart.useMutation();
  const [quantity, setQuantity] = useState(1);
  const paypalRef = useRef<HTMLDivElement>(null);

  const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuantity(parseInt(event.target.value));
  };
  useEffect(() => {
    if (paypalRef?.current && paypalRef.current.children.length <= 0) {
      loadPaypal(
        "#" + paypalRef.current.id,
        product.variants[0]?.price as number
      );
    }
  }, [paypalRef]);

  const handleAddToCart = async () => {
    await addToCart({
      productId: product.id,
      description: product.description,
      title: product.title,
      picture: product.images[0]?.src as string,
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
                ${product.sales_channel_properties[0]}
              </span>
              <span className="ml-4 text-gray-500">In stock</span>
            </div>
            <div className="mt-6">
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
                value={quantity}
                onChange={handleQuantityChange}
                className="mt-2 h-10 w-16 rounded-md border-gray-300 bg-skin-secondary px-2 text-white 
                shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <button
              className="mt-6 rounded-md bg-black py-3 px-4 text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75"
              onClick={handleAddToCart}
            >
              Add to cart
            </button>
            <div className="flex w-full items-center justify-center">
              <div
                id="paypal-section"
                className="mt-5 w-1/2"
                ref={paypalRef}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
