import { useEffect, useRef, useState } from "react";
import Head from "next/head";
import { api } from "../../utils/api";
import { useRouter } from "next/router";
import { Product, UserCartProducts } from "@prisma/client";
import { loadPaypal } from "../../components/paypalButtons";
import { formatLineItems } from "../../utils/formatLineItems";

export default function CheckoutPage() {
  const [billingAddress, setBillingAddress] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [selected, setSelected] = useState<number[]>([]);
  const { data: products, isLoading } = api.cart.getCart.useQuery();
  const { mutateAsync: createOrder } =
    api.printify.createPrintifyOrder.useMutation();
  const { refetch: getUserDetails } = api.user.getUserDetails.useQuery(
    undefined,
    { enabled: false }
  );

  const paypalRef = useRef<HTMLDivElement>(null);

  const handleCheckout = () => {};
  useEffect(() => {
    if (
      paypalRef?.current &&
      paypalRef.current.children.length <= 0 &&
      !isLoading &&
      products
    ) {
      const priceInDollars =
        (products?.reduce((prev, curr) => {
          return prev + curr.price;
        }, 0) as number) / 100;
      loadPaypal(
        "#" + paypalRef.current.id,
        priceInDollars,
        async () => {
          if (products.length < 1 || selected.length < 1) return;
          const line_items = await formatLineItems(products, selected);
          await createOrder({
            line_items,
          });
        },
        async (data, actions) => {
          return getUserDetails().then((res) => {
            if (res.data && res.data.length > 0) {
              alert("please add your personal details before the purchase");
              console.log(actions);
              return actions.reject();
            }
          });
        }
      );
    }
  }, [paypalRef, isLoading]);

  return (
    <>
      <Head>
        <title>Checkout</title>
      </Head>
      <div>
        <h1>Checkout</h1>
        <form onSubmit={handleCheckout}>
          <label>Billing Address</label>
          <input
            type="text"
            value={billingAddress}
            onChange={(e) => setBillingAddress(e.target.value)}
          />

          <label>Shipping Address</label>
          <input
            type="text"
            value={shippingAddress}
            onChange={(e) => setShippingAddress(e.target.value)}
          />

          <label>Payment Method</label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
          >
            <option value="">Select a payment method</option>
            <option value="credit-card">Credit Card</option>
            <option value="paypal">Paypal</option>
          </select>

          <div id="paypal-section" className="mt-5 w-1/2" ref={paypalRef}></div>
          <button
            type="submit"
            disabled={!billingAddress || !shippingAddress || !paymentMethod}
          ></button>
        </form>
      </div>
    </>
  );
}
