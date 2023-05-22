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

type MinimalEntityType = { id: string; picture: string | null; name: string };
type CheckoutContextProps = {
	createOrder: (
		props: RouterInputs["printify"]["createPrintifyOrder"]
	) => Promise<void>;
	detailsLoading: boolean;
	userDetails?: RouterOutputs["user"]["getUserDetails"];
	shippingCost?: RouterOutputs["printify"]["calculateOrderShipping"];
	handleOnApprove: PayPalButtonsComponentProps["onApprove"];
	handleCreateOrder: PayPalButtonsComponentProps["createOrder"];
	handleChangeQuantity: (productId: string, quantity: number) => void;
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
	handleSelectProduct: (index) => { },
	handleChangeQuantity: (productId: string, quantity: number) => { },
	detailsLoading: false,
	products: [],
	selected: [],
	address: "",
	setAddress: () => { },
	setSelected: () => { },
	totalPrice: 0,
	setEntity: () => { },
	handleOnApprove: async (data, actions) => { },
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
	const [entity, setEntity] = useState<MinimalEntityType | undefined>();
	const context = api.useContext();

	const { mutateAsync: createOrder, isLoading: orderLoading } =
		api.printify.createPrintifyOrder.useMutation();

	const {
		data: userDetails,
		isLoading: detailsLoading,
		error: detailsError,
	} = api.user.getUserDetails.useQuery();

	const { data: shippingCost, mutateAsync: calculateShippingCost } =
		api.printify.calculateOrderShipping.useMutation();

	const totalPrice = useMemo(() => {
		const filteredProducts = filterProducts(products, selected, true);
		return filteredProducts.reduce((prev, curr) => {
			return prev + curr.price * curr.quantity;
		}, 0);
	}, [selected, products]);

	const handleChangeQuantity = (productId: string, quantity: number) => {
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
		if (!detailsLoading && !detailsError) {
			if (!userDetails?.[0]) return;
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
		if (line_items && line_items.length > 1 && userDetails?.[0] && entity)
			await createOrder({
				line_items: line_items,
				entityId: entity.id,
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
		if (userDetails && userDetails.length <= 0) {
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

				entity,
				setEntity,

				products,
				totalPrice,
				shippingCost,

				userDetails,
				detailsLoading,

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
