import type { Dispatch, ReactNode, SetStateAction } from "react";
import { useMemo } from "react";
import { createContext, useContext, useEffect, useState } from "react";
import type { RouterInputs, RouterOutputs } from "../utils/api";
import { api } from "../utils/api";
import type { UserAddress } from "@prisma/client";
import type { PayPalButtonsComponentProps } from "@paypal/react-paypal-js";
import { formatLineItems } from "../utils/formatLineItems";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { string } from "zod";

type MinimalEntityType = { id: string; picture: string | null; name: string };
type CheckoutContextProps = {
  createOrder: (
    props: RouterInputs["printify"]["createPrintifyOrder"]
  ) => Promise<void>;
  handleOnClick: PayPalButtonsComponentProps["onClick"];
  detailsLoading: boolean;
  userDetails?: RouterOutputs["user"]["getUserDetails"];
  shippingCost?: RouterOutputs["printify"]["calculateOrderShipping"];
  handleOnApprove: PayPalButtonsComponentProps["onApprove"];
  handleCreateOrder: PayPalButtonsComponentProps["createOrder"];
  products: RouterOutputs["cart"]["getCart"];
  totalPrice: number;
  handleSelectProduct: (idx: number) => void;
  handleRemoveCartProduct: (prodIdx: number) => void;
  selected: number[];
  setSelected: Dispatch<SetStateAction<number[]>>;
  entity?: MinimalEntityType | undefined;
  setEntity: Dispatch<SetStateAction<MinimalEntityType | undefined>>;
  removeProductLoading: boolean;
};
export const CheckoutContext = createContext<CheckoutContextProps>({
  createOrder: async (props) => undefined,
  handleOnClick: async (data, actions) => {},
  handleSelectProduct: (index) => {},
  handleRemoveCartProduct: (productId) => {},
  detailsLoading: false,
  products: [],
  selected: [],
  removeProductLoading: false,
  setSelected: () => {},
  totalPrice: 0,
  setEntity: () => {},
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
  const [entity, setEntity] = useState<MinimalEntityType | undefined>();
  const context = api.useContext();
  const { mutateAsync: removeCartProduct, isLoading: removeProductLoading } =
    api.cart.removeProductFromCart.useMutation({
      onSuccess() {
        context.cart.getCart.invalidate();
      },
    });

  const { mutateAsync: createOrder, isLoading: orderLoading } =
    api.printify.createPrintifyOrder.useMutation();

  const totalPrice = useMemo(
    () =>
      products.reduce((prev, curr) => {
        return prev + curr.price;
      }, 0),
    [products]
  );
  const {
    data: userDetails,
    isLoading: detailsLoading,
    error: detailsError,
  } = api.user.getUserDetails.useQuery();

  const { data: shippingCost, mutateAsync: calculateShippingCost } =
    api.printify.calculateOrderShipping.useMutation();

  const handleSelectProduct = (prodIdx: number) => {
    if (selected.find((id) => id == prodIdx) === undefined) {
      setSelected([...selected, prodIdx]);
    } else {
      setSelected([...selected.filter((id) => id !== prodIdx)]);
    }
  };
  const handleRemoveCartProduct = async (prodIdx: number) => {
    const prod = products[prodIdx];
    if (prod) {
      await removeCartProduct({ productId: prod.productId });
      setSelected([...selected.filter((id) => id !== prodIdx)]);
    }
  };

  useEffect(() => {
    if (!detailsLoading && !detailsError) {
      if (!userDetails?.[0]) {
        return;
      }
      const { id, userId, title, ...address_to } =
        userDetails[0] as UserAddress;
      if (products.length > 0) {
        calculateShippingCost({
          address_to,
          line_items: products.map((product) => {
            return {
              product_id: product.productId,
              variant_id: product.variantId,
              quantity: product.quantity,
            };
          }),
        });
      }
    }
  }, [detailsLoading, detailsError]);

  const handleCreateOrder: PayPalButtonsComponentProps["createOrder"] = async (
    data,
    actions
  ) => {
    const isSelected = selected.length > 0;
    const filteredProducts = isSelected
      ? products.filter((_, prodIdx) => prodIdx == selected[prodIdx])
      : products;
    const price =
      filteredProducts.reduce((prev, curr) => {
        return prev + curr.price;
      }, 0) / 100;
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            value: (
              price +
              (shippingCost?.standard as number) / 100
            ).toString(),
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
    if (line_items && line_items.length > 1 && userDetails?.[0] && entity)
      await createOrder({
        line_items: line_items,
        entityId: entity.id,
        addressId: userDetails[0].id as string,
        totalPrice: totalPrice,
        totalShipping: shippingCost?.standard as number,
      });
    return actions?.order?.capture().then((details) => {
      const name = details?.payer?.name?.given_name;
      toast.success(`Transaction completed by ${name}`);
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
        handleSelectProduct,
        handleRemoveCartProduct,
        entity,
        setEntity,
        totalPrice,
        products,
        createOrder,
        shippingCost,
        userDetails,
        detailsLoading,
        removeProductLoading,
        selected,
        setSelected,
      }}
    >
      {children}
    </CheckoutContext.Provider>
  );
};
