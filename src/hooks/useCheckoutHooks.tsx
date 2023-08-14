import type { Dispatch, ReactNode, SetStateAction } from "react";
import { useMemo } from "react";
import { createContext, useContext, useEffect, useState } from "react";
import type { RouterInputs, RouterOutputs } from "../utils/api";
import { api } from "../utils/api";
import type { Product, UserAddress } from "@prisma/client";
import type { PayPalButtonsComponentProps } from "@paypal/react-paypal-js";
import { formatLineItems } from "../utils/formatLineItems";
import { toast } from "react-toastify";
import { filterProducts } from "../utils/filterProducts";
import { TRPCError } from "@trpc/server";
import { TRPCClientError } from "@trpc/client";

type MinimalEntityType = { id: string; picture: string | null; name: string };
type CheckoutContextProps = {
  createOrder: (
    props: RouterInputs["order"]["createPrintifyOrder"]
  ) => Promise<void>;
  detailsLoading: boolean;
  shippingLoading: boolean;
  userDetails?: RouterOutputs["user"]["getUserAddress"];
  shippingCost?: RouterOutputs["order"]["calculateOrderShipping"];
  handleOnApprove: PayPalButtonsComponentProps["onApprove"];
  handleCreateOrder: PayPalButtonsComponentProps["createOrder"];
  handleChangeQuantity: (productId: string, quantity: number) => void;
  handleChangeSize: (productId: string, variantId: number) => void;
  handleUpdateShippingCost: () => Promise<void>;
  quantityChanged: boolean;
  setQuantityChanged: Dispatch<boolean>;
  products: RouterOutputs["cart"]["getCart"];
  totalPrice: number;
  handleSelectProduct: (id: string) => void;
  selected: string[];
  setSelected: Dispatch<SetStateAction<string[]>>;
  entity?: MinimalEntityType | undefined;
  setEntity: Dispatch<SetStateAction<MinimalEntityType | undefined>>;
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
  quantityChanged: false,
  products: [],
  selected: [],
  address: "",
  setAddress: () => {},
  setQuantityChanged: () => {},
  setSelected: () => {},
  totalPrice: 0,
  setEntity: () => {},
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
  const [quantityChanged, setQuantityChanged] = useState(false);
  const [entity, setEntity] = useState<MinimalEntityType | undefined>();
  const context = api.useContext();

  const { mutateAsync: createOrder, isLoading: orderLoading } =
    api.order.createPrintifyOrder.useMutation();

  const {
    data: userAddresses,
    isLoading: addressesLoading,
    error: addressError,
  } = api.user.getUserAddress.useQuery();

  const {
    data: shippingCost,
    mutateAsync: calculateShippingCost,
    isLoading: shippingLoading,
  } = api.order.calculateOrderShipping.useMutation();

  const totalPrice = useMemo(() => {
    const filteredProducts = filterProducts(products, selected, true);
    return filteredProducts.reduce((prev, curr) => {
      return prev + curr.price * curr.quantity;
    }, 0);
  }, [selected, products]);

  const handleUpdateShippingCost = async () => {
    const { id, userId, title, ...address_to } =
      userAddresses?.[0] as UserAddress;
    if (products.length > 0) {
      await calculateShippingCost({
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
    setQuantityChanged(false);
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
    setQuantityChanged(true);
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
    if (!addressesLoading && !addressError) {
      if (!userAddresses?.[0]) return;
      const { id, userId, title, ...address_to } =
        userAddresses[0] as UserAddress;

      if (products.length > 0) {
        setSelected(
          products.map((item) => {
            return item.productId;
          })
        );
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
              totalPrice / 100 +
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
    if (line_items && line_items.length > 0 && address)
      await createOrder({
        line_items: line_items,
        entityId: entity?.id,
        addressId: address,
        totalPrice: totalPrice,
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

        entity,
        setEntity,

        quantityChanged,
        handleUpdateShippingCost,

        setQuantityChanged,

        products,
        totalPrice,
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
