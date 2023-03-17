import React from "react";
import { ClipLoader } from "react-spinners";
import CategoryCard from "../../components/CategoryCard";
import ImageInput from "../../components/ImageInput";
import { api } from "../../utils/api";

const UserCart = () => {
  const { data, isLoading } = api.user.getCart.useQuery();
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-skin-main">
        <ClipLoader color="white" />
      </div>
    );
  }
  return (
    <div className="min-h-screen w-full bg-skin-main text-skin-base">
      <div className="flex w-full px-12">
        {data?.map((product) => {
          return (
            <div className="mx-4 w-1/2" key={product.productId}>
              <CategoryCard
                title={product.product.title}
                href={product.product.picture}
                src={product.product.picture}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default UserCart;
