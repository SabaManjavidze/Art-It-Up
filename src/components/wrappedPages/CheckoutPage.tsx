import type { PayPalButtonsComponentProps } from "@paypal/react-paypal-js";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { useEffect, useState } from "react";
import type { RouterOutputs } from "../../utils/api";
import { api } from "../../utils/api";
import { formatLineItems } from "../../utils/formatLineItems";
import Link from "next/link";
import Image from "next/image";
import Layout from "../Layout";
import CheckoutWizard from "../CheckoutWizard";
import type { UserAddress } from "@prisma/client";
import type { Payer } from "@paypal/paypal-js";
import { CreateOrderActions, CreateOrderData } from "@paypal/paypal-js";

type CheckoutPagePropType = {
  user: RouterOutputs["user"]["me"];
  products: RouterOutputs["cart"]["getCart"];
};
export default function CheckoutPage({ user, products }: CheckoutPagePropType) {
  const [selected, setSelected] = useState<number[]>([]);
  const { mutateAsync: createOrder, isLoading: orderLoading } =
    api.printify.createPrintifyOrder.useMutation();
  const { data: userDetails, isLoading: detailsLoading } =
    api.user.getUserDetails.useQuery();
  const {
    data: shippingCost,
    mutateAsync: calculateShippingCost,
    isLoading: shippingLoading,
  } = api.printify.calculateOrderShipping.useMutation();

  useEffect(() => {
    if (!detailsLoading) {
      if (!userDetails?.[0]) return;
      const { id, userId, title, ...address_to } =
        userDetails[0] as UserAddress;
      calculateShippingCost({
        address_to: { ...address_to, zip: address_to.zip.toString() },
        line_items: products.map((product) => {
          return {
            product_id: product.productId,
            variant_id: product.variantId,
            quantity: product.quantity,
          };
        }),
      });
    }
  }, [detailsLoading]);

  const handleOnApprove: PayPalButtonsComponentProps["onApprove"] = async (
    data,
    actions
  ) => {
    const line_items = await formatLineItems(
      products as NonNullable<typeof products>,
      selected
    );
    if (line_items && line_items.length > 1)
      await createOrder({
        line_items: line_items,
      });
    return actions?.order?.capture().then((details) => {
      const name = details?.payer?.name?.given_name;
      console.log(`Transaction completed by ${name}`);
    });
  };
  const handleOnClick: PayPalButtonsComponentProps["onClick"] = async (
    data,
    actions
  ) => {
    if (userDetails && userDetails.length <= 0) {
      alert("please add your personal details before the purchase");
      return actions.reject();
    }
    return actions.resolve();
  };
  const handleCreateOrder: PayPalButtonsComponentProps["createOrder"] = async (
    data,
    actions
  ) => {
    const price =
      products.reduce((prev, curr) => {
        return prev + curr.price;
      }, 0) / 100;
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            value: price.toString(),
          },
        },
      ],
    });
  };
  return (
    <Layout title="Place Order">
      <CheckoutWizard activeStep={3} />
      <h1 className="mb-4 text-xl">Place Order</h1>
      {products.length === 0 ? (
        <div>
          Cart is empty. <Link href="/">Go shopping</Link>
        </div>
      ) : (
        <div className="bloc bg-skin-main md:grid-rows-none md:gap-0 lg:grid lg:grid-cols-4 lg:gap-5">
          <div className="overflow-x-auto md:col-span-3">
            <div className="card  p-5">
              <h2 className="mb-2 text-lg">Shipping Address</h2>
              <div>
                {user.name}, {userDetails?.[0]?.address1},{" "}
                {userDetails?.[0]?.city}, {userDetails?.[0]?.zip},{" "}
                {userDetails?.[0]?.country}
              </div>
              <div>
                <Link href="/shipping">Edit</Link>
              </div>
            </div>
            <div className="card overflow-x-auto p-5">
              <h2 className="mb-2 text-lg">Order Items</h2>
              <table className="min-w-full">
                <thead className="border-b">
                  <tr>
                    <th className="px-5 text-left">Item</th>
                    <th className="    p-5 text-right">Quantity</th>
                    <th className="  p-5 text-right">Price</th>
                    <th className="p-5 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((cartItem) => (
                    <tr key={cartItem.productId} className="border-b">
                      <td>
                        <Link
                          className="flex items-center"
                          href={`/product/${cartItem.productId}`}
                        >
                          <Image
                            src={cartItem.product.picture}
                            alt={cartItem.product.title}
                            width={50}
                            height={50}
                          ></Image>
                          &nbsp;
                          {cartItem.product.title}
                        </Link>
                      </td>
                      <td className=" p-5 text-right">{cartItem.quantity}</td>
                      <td className="p-5 text-right">
                        ${cartItem.price / 100}
                      </td>
                      <td className="p-5 text-right">
                        ${cartItem.quantity * cartItem.price}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div>
                <Link href="/cart">Edit</Link>
              </div>
            </div>
          </div>
          <div>
            <div className="card  p-5">
              <h2 className="mb-2 text-lg">Order Summary</h2>
              <ul>
                <li>
                  <div className="mb-2 flex justify-between">
                    <div>Items</div>
                    {/* <div>${itemsPrice}</div> */}
                  </div>
                </li>
                <li>
                  <div className="mb-2 flex justify-between">
                    <div>Tax</div>
                    {/* <div>${taxPrice}</div> */}
                  </div>
                </li>
                <li>
                  <div className="mb-2 flex justify-between">
                    {shippingCost ? (
                      <div>
                        Shipping
                        <div className="ml-3">
                          <div>
                            Standard: $
                            {parseInt(shippingCost?.standard?.toString()) / 100}
                          </div>
                          {shippingCost?.express ? (
                            <div>
                              Express: $
                              {parseInt(shippingCost?.express?.toString()) /
                                100}
                            </div>
                          ) : null}
                        </div>
                      </div>
                    ) : null}
                  </div>
                </li>
                <li>
                  <div className="mb-2 flex justify-between">
                    <div>Total</div>
                    {/* <div>${totalPrice}</div> */}
                  </div>
                </li>
                <li>
                  <PayPalScriptProvider
                    options={{
                      "client-id": process.env.PAYPAL_CLIENT_ID as string,
                    }}
                  >
                    <PayPalButtons
                      style={{
                        label: "checkout",
                        tagline: false,
                        shape: "pill",
                      }}
                      onApprove={handleOnApprove}
                      onClick={handleOnClick}
                      createOrder={handleCreateOrder}
                    />
                  </PayPalScriptProvider>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
