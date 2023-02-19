import { useState } from "react";
import { useRouter } from "next/router";
import { ClipLoader } from "react-spinners";
import Image from "next/image";
import { api } from "../../utils/api";

const ProductPage = () => {
  const router = useRouter();
  const productId = router.query.productId as string;
  const { data: product, error } = api.printify.getPrintifyProduct.useQuery({
    product_id: productId,
  });
  const [quantity, setQuantity] = useState(1);

  if (error) {
    return <div>Failed to load product: {error.message}</div>;
  }

  if (!product) {
    return (
      <div className="flex h-screen items-center justify-center">
        <ClipLoader />
      </div>
    );
  }

  const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuantity(parseInt(event.target.value));
  };

  const handleAddToCart = () => {
    // Add the product to the cart with the selected quantity
  };

  return (
    <div className="min-h-screen w-full bg-skin-main text-white">
      <div className="container mx-auto py-10">
        <div className="grid grid-cols-2 gap-8">
          <div>
            <Image
              src={product.images[0]?.src + ""}
              alt={product.title}
              width={600}
              height={600}
            />
          </div>
          <div>
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
