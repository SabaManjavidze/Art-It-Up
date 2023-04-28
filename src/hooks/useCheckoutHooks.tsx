import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useState } from "react";
import type { RouterInputs, RouterOutputs } from "../utils/api";
import { api } from "../utils/api";
import type { UserAddress } from "@prisma/client";
import type { PayPalButtonsComponentProps } from "@paypal/react-paypal-js";
import { formatLineItems } from "../utils/formatLineItems";

type CheckoutContextProps = {
  createOrder: (
    props: RouterInputs["printify"]["createPrintifyOrder"]
  ) => Promise<RouterOutputs["printify"]["createPrintifyOrder"]>;
  handleOnClick: PayPalButtonsComponentProps["onClick"];
  detailsLoading: boolean;
  userDetails?: RouterOutputs["user"]["getUserDetails"];
  shippingCost?: RouterOutputs["printify"]["calculateOrderShipping"];
  handleOnApprove: PayPalButtonsComponentProps["onApprove"];
  handleCreateOrder: PayPalButtonsComponentProps["createOrder"];
};
export const CheckoutContext = createContext<CheckoutContextProps>({
  createOrder: async (props) => {
    return { errors: null, success: true };
  },
  handleOnClick: async (data, actions) => {},
  detailsLoading: false,
  userDetails: undefined,
  handleOnApprove: async (data, actions) => {},
  handleCreateOrder: async (data, actions) => "",
});
export const useCheckout = () => useContext(CheckoutContext);

export const CheckoutProvider = ({
  children,
  products,
}: {
  products: RouterOutputs["cart"]["getCart"];
  children: ReactNode;
}) => {
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
  return (
    <CheckoutContext.Provider
      value={{
        handleOnClick,
        handleOnApprove,
        handleCreateOrder,
        createOrder,
        shippingCost,
        userDetails,
        detailsLoading,
      }}
    >
      {children}
    </CheckoutContext.Provider>
  );
};
