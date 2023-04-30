import React from "react";
import { ClipLoader } from "react-spinners";
import { api } from "../../utils/api";
import { CheckoutProvider } from "../../hooks/useCheckoutHooks";
import CartPage from "../../components/wrappedPages/CartPage";

const UserCart = () => {
  const { data, isLoading, error } = api.cart.getCart.useQuery();
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-skin-main">
        <ClipLoader color="white" />
      </div>
    );
  }
  if (error) return <p>something went wrong</p>;
  return (
    <CheckoutProvider products={data}>
      <CartPage />
    </CheckoutProvider>
  );
};

export default UserCart;
