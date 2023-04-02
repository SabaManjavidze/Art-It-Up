import React from "react";
import { ClipLoader } from "react-spinners";
import CategoryCard from "../../components/CategoryCard";
import { api } from "../../utils/api";
import Link from "next/link";

const UserCart = () => {
  const { data, isLoading } = api.cart.getCart.useQuery();
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-skin-main">
        <ClipLoader color="white" />
      </div>
    );
  }
  return (
    <div className="min-h-screen w-full bg-skin-main text-skin-base">
      <Link
        href={"/user/checkout"}
        className="fixed bottom-5 right-5 rounded-md bg-black px-5 py-2 text-2xl text-white"
      >
        <h2>Checkout Now!</h2>
      </Link>
      <div className="flex w-full px-12">
        {data?.map((cartProduct) => {
          return (
            <div className="mx-4 w-1/2" key={cartProduct.productId}>
              <CategoryCard
                title={cartProduct.product.title}
                src={cartProduct.product.picture}
                href={`/product/${cartProduct.productId}`}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default UserCart;
