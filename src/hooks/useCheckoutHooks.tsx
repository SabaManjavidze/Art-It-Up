import type { Dispatch, ReactNode, SetStateAction } from "react";
import { useMemo } from "react";
import { createContext, useContext, useEffect, useState } from "react";
import type { RouterInputs, RouterOutputs } from "../utils/api";
import { api } from "../utils/api";
import type { Product, UserAddress } from "@prisma/client";
import type { PayPalButtonsComponentProps } from "@paypal/react-paypal-js";
import { formatLineItems } from "@/utils/checkout/formatLineItems";
import { toast } from "react-toastify";
import { filterProducts } from "../utils/checkout/filterProducts";
import { TRPCError } from "@trpc/server";
import { TRPCClientError } from "@trpc/client";

type CheckoutContextProps = {
  createOrder: (props: RouterInputs["order"]["createOrder"]) => Promise<void>;
  detailsLoading: boolean;
  shippingLoading: boolean;
  userDetails?: RouterOutputs["address"]["getUserAddress"];
  shippingCost?: RouterOutputs["order"]["calculateOrderShipping"];
  handleOnApprove: PayPalButtonsComponentProps["onApprove"];
  handleCreateOrder: PayPalButtonsComponentProps["createOrder"];
  handleChangeQuantity: (productId: string, quantity: number) => void;
  handleChangeSize: (productId: string, variantId: number) => void;
  handleUpdateShippingCost: () => Promise<void>;
  valuesChanged: boolean;
  setValuesChanged: Dispatch<boolean>;
  products: RouterOutputs["cart"]["getCart"];
  totalPrice: number;
  handleSelectProduct: (id: string) => void;
  selected: string[];
  setSelected: Dispatch<SetStateAction<string[]>>;
  address: string;
  setAddress: Dispatch<SetStateAction<string>>;
  checkIfReady: () => boolean;
};
export const CheckoutContext = createContext<CheckoutContextProps>({
  createOrder: async (props) => undefined,
  handleSelectProduct: (index) => {},
  handleChangeQuantity: (productId: string, quantity: number) => {},
  handleChangeSize: (productId: string, variantId: number) => {},
  handleUpdateShippingCost: async () => undefined,
  detailsLoading: true,
  shippingLoading: true,
  valuesChanged: false,
  products: [],
  selected: [],
  address: "",
  setAddress: () => {},
  setValuesChanged: () => {},
  setSelected: () => {},
  totalPrice: 0,
  handleOnApprove: async (data, actions) => {},
  handleCreateOrder: async (data, actions) => "",
  checkIfReady: () => false,
});
export const useCheckout = () => useContext(CheckoutContext);

export const CheckoutProvider = ({
  children,
  products,
}: {
  products: RouterOutputs["cart"]["getCart"];
  children: ReactNode;
}) => {
  const [selected, setSelected] = useState<string[]>([]);
  const [address, setAddress] = useState<string>("");
  const [valuesChanged, setValuesChanged] = useState(false);
  const context = api.useContext();

  const { mutateAsync: createOrder, isLoading: orderLoading } =
    api.order.createOrder.useMutation();

  const {
    data: userAddresses,
    isLoading: addressesLoading,
    error: addressError,
  } = api.address.getUserAddress.useQuery();

  const {
    data: shippingCost,
    mutateAsync: calculateShippingCost,
    isLoading: shippingLoading,
  } = api.order.calculateOrderShipping.useMutation();

  const subTotalPrice = useMemo(() => {
    const filteredProducts = filterProducts(products, selected, true);
    return filteredProducts.reduce((prev, curr) => {
      return prev + curr.price * curr.quantity;
    }, 0);
  }, [selected, products]);

  const handleUpdateShippingCost = async () => {
    if (!userAddresses?.[0]) {
      toast.error("Add a shipping address to reveal the cost");
      return;
    }
    const { id, userId, title, ...address_to } =
      userAddresses[0] as UserAddress;
    if (products.length > 0) {
      const line_items = formatLineItems(products, selected, "printify");
      await calculateShippingCost({
        address_to: {
          ...address_to,
          address2: address_to?.address2 || undefined,
        },
        line_items,
      });
    }
    setValuesChanged(false);
  };
  const handleChangeSize = (productId: string, price: number) => {
    context.cart.getCart.setData(
      undefined,
      products.map((prod) => {
        if (prod.productId == productId) {
          return {
            ...prod,
            price,
          };
        }
        return prod;
      })
    );
  };
  const handleChangeQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) return;
    setValuesChanged(true);
    context.cart.getCart.setData(
      undefined,
      products.map((prod) => {
        if (prod.productId == productId) {
          return {
            ...prod,
            quantity,
          };
        }
        return prod;
      })
    );
  };

  const handleSelectProduct = (prodId: string) => {
    if (selected.find((id) => id == prodId) === undefined) {
      setSelected([...selected, prodId]);
    } else {
      setSelected([...selected.filter((id) => id !== prodId)]);
    }
  };

  useEffect(() => {
    if (products.length > 0) {
      setSelected(
        products.map((item) => {
          return item.productId;
        })
      );
    }
    if (!addressesLoading && !addressError) {
      if (!userAddresses?.[0]) return;
      const { id, userId, title, ...address_to } =
        userAddresses[0] as UserAddress;
      setAddress(userAddresses.find((addr) => !!addr.selected)?.id || "");

      if (products.length > 0) {
        calculateShippingCost({
          address_to: {
            ...address_to,
            address2: address_to?.address2 || undefined,
          },
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
  }, [addressesLoading, addressError]);

  const handleCreateOrder: PayPalButtonsComponentProps["createOrder"] = async (
    data,
    actions
  ) => {
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            value: (
              subTotalPrice / 100 +
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
    const line_items = formatLineItems(
      products as NonNullable<typeof products>,
      selected,
      "default"
    );
    if (line_items && line_items.length > 0 && address)
      await createOrder({
        line_items: line_items,
        addressId: address,
        totalPrice: subTotalPrice,
        totalShipping: shippingCost?.standard as number,
      });
    return actions?.order?.capture().then((details) => {
      const name = details?.payer?.name?.given_name;
      toast.success(`Transaction completed by ${name}`);
    });
  };
  const checkIfReady = () => {
    if (userAddresses && userAddresses.length <= 0) {
      alert("please add your personal details before the purchase");
      return false;
    } else if (!address) {
      alert("please choose the shipping address");
      return false;
    } else if (!selected.length) {
      alert("please choose wanted products");
      return false;
    }
    return true;
  };
  return (
    <CheckoutContext.Provider
      value={{
        handleOnApprove,
        handleCreateOrder,
        handleSelectProduct,
        handleChangeQuantity,
        handleChangeSize,

        valuesChanged,
        handleUpdateShippingCost,

        setValuesChanged,

        products,
        totalPrice: subTotalPrice,
        shippingCost,

        userDetails: userAddresses,
        detailsLoading: addressesLoading,

        shippingLoading,

        selected,
        setSelected,

        address,
        setAddress,

        createOrder,
        checkIfReady,
      }}
    >
      {children}
    </CheckoutContext.Provider>
  );
};
