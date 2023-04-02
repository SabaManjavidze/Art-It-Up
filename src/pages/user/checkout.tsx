import { api } from "../../utils/api";

import CheckoutPage from "../../components/wrappedPages/CheckoutPage";
import { ClipLoader } from "react-spinners";

export default function CheckoutPageContainer() {
  const { data: products, isLoading: cartLoading } =
    api.cart.getCart.useQuery();

  const { data: user, isLoading: profileLoading } = api.user.me.useQuery();

  if (cartLoading || profileLoading)
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-skin-main">
        <ClipLoader size={200} color={"white"} />
      </div>
    );
  if (!products || !user)
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-skin-main text-white">
        <h2>Something Went Wrong!</h2>
      </div>
    );
  return <CheckoutPage products={products} user={user} />;
}
