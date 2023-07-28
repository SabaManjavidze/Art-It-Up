import React from "react";
import { Loader2 } from "lucide-react";
import { api } from "../../utils/api";
import { CheckoutProvider } from "../../hooks/useCheckoutHooks";
import CartPage from "../../components/WrappedPages/CartPage";

const UserCart = () => {
  const { data, isLoading, error } = api.cart.getCart.useQuery();
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 color="white" />
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
