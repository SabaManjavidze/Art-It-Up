import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useState } from "react";

export default function Wishlist() {
  const [wishlist, setWishlist] = useState([
    { id: 1, name: "Product 1", price: "$10" },
    { id: 2, name: "Product 2", price: "$20" },
    { id: 3, name: "Product 3", price: "$30" },
  ]);
  const [divRef] = useAutoAnimate<HTMLDivElement>();

  const handleRemove = (product_id: string) => {
    setWishlist((prevWishlist) =>
      prevWishlist.filter((item) => item.id.toString() !== product_id)
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex min-h-screen flex-col items-center justify-center py-8">
        <h1 className="mb-4 text-2xl font-bold">My Wishlist</h1>
        <div className="w-full" ref={divRef}>
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
                className="rounded-md bg-red-500 px-4 py-2 text-primary-foreground"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
