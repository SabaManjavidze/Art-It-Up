import { useState } from "react";
import { Transition } from "@headlessui/react";

export default function Wishlist() {
  const [wishlist, setWishlist] = useState([
    { id: 1, name: "Product 1", price: "$10" },
    { id: 2, name: "Product 2", price: "$20" },
    { id: 3, name: "Product 3", price: "$30" },
  ]);
  const [selectedProduct, setSelectedProduct] = useState("");

  const handleRemove = (product_id: string) => {
    setSelectedProduct(product_id);
    setTimeout(() => {
      setWishlist((prevWishlist) =>
        prevWishlist.filter((item) => item.id.toString() !== product_id)
      );
      setSelectedProduct("");
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex min-h-screen flex-col items-center justify-center py-8">
        <h1 className="mb-4 text-2xl font-bold">My Wishlist</h1>
        <div className="w-full">
          {wishlist.map((product) => (
            <div
              key={product.id}
              className="mb-4 flex items-center justify-between rounded-lg bg-white p-4 shadow-md"
            >
              <div>
                <h2 className="text-lg font-medium">{product.name}</h2>
                <p className="text-gray-500">{product.price}</p>
              </div>
              <button
                onClick={() => handleRemove(product.id.toString())}
                className="rounded-md bg-red-500 px-4 py-2 text-white"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
        <Transition
          show={!!selectedProduct}
          enter="transition ease-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition ease-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="absolute top-0 left-0 flex h-full w-full items-center justify-center">
            <div className="rounded-md bg-white p-4 shadow-md">
              <p className="mb-4 text-lg font-medium">Removing Product...</p>
              <div className="mx-auto h-24 w-24">
                <svg
                  className="h-full w-full animate-spin text-red-500"
                  xmlns="<http://www.w3.org/2000/svg>"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm12 0a8 8 0 100-16v3a5 5 0 010 10v3a8 8 0 008 8h4a12 12 0 01-12 12v-3a9 9 0 009-9v-3z"
                  ></path>
                </svg>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  );
}
