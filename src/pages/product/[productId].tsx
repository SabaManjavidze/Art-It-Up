import { api } from "../../utils/api";
import { useEffect } from "react";
import { RadioGroup } from "@headlessui/react";
import { ClipLoader } from "react-spinners";
import { useRef, useState } from "react";
import { toast } from "react-toastify";
import Image from "next/image";


type OptionType = {
	quantity: number;
	size: number;
	variantId: number;
	cost: number;
};
const ProductPageContainer = ({ productId }: { productId: string }) => {
	const {
		data: product, error
	} = api.printify.getPrintifyProduct.useQuery(
		{
			id: productId,
		},
	);
	const utils = api.useContext()
	const { mutateAsync: addToCart, isLoading: addToCartLoading } =
		api.cart.addProductToCart.useMutation({
			onSuccess() {
				utils.printify.getPrintifyProduct.invalidate()
			},
		});
	const descRef = useRef<HTMLParagraphElement>(null)

	const [options, setOptions] = useState<OptionType>({
		quantity: 1,
		size: product?.options[1]?.values[0]?.id as number,
		variantId: product?.variants[0]?.id as number,
		cost: product?.variants[0]?.cost as number,
	});

	useEffect(() => {
		if (descRef?.current) {
			descRef.current.innerHTML = product?.description || ""
		}
	}, [descRef])

	if (error || !product) return <h1>there was an error {JSON.stringify(error, null, 2)}</h1>
	const handleAddToCart = async () => {
		try {
			await addToCart({
				productId: product.id,
				description: product.description,
				title: product.title,
				picture: product.images[0]?.src as string,
				sizeId: options.size,
				sizeTitle: product.options[1]?.values.find(size => size.id == options.size)?.title as string,
				variantId: options.variantId,
				quantity: options.quantity,
				price: options.cost / options.quantity,
				isInCart: product.isInCart
			});
			if (product.isInCart) {
				toast.info("Removed product from your cart");
			}
			else {
				toast.success("A product has been added to your cart");
			}
		} catch (error) {
			toast.error(
				error as string
			);
		}
	};
	const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const quantity = parseInt(event.target.value);
		const originalCost = product.variants.find(
			(variant) => variant.id == options.variantId
		)?.cost as number;
		setOptions({
			...options,
			quantity,
			cost: originalCost * quantity,
		});
	};

	const handleSizeChange = (id: number) => {
		const variant = product.variants.find((varItem) => {
			if (!product.isClothe) return varItem.options[0] == id;
			const defaultColorId = product?.options[0]?.values[0]?.id as number;
			return varItem.options[1] == id && varItem.options[0] == defaultColorId;
		});
		setOptions({
			...options,
			size: id,
			cost: (variant?.cost as number) * options.quantity,
			variantId: variant?.id as number,
		});
	};

	return (
		<div className="bg-skin-main">
			<div className="pt-6">
				<nav aria-label="Breadcrumb">
					<ol
						role="list"
						className="mx-auto flex max-w-2xl items-center space-x-2 px-4 sm:px-6 lg:max-w-7xl lg:px-8"
					>
						<li className="text-sm">
							<Link
								href={`/product/${product.id}`}
								aria-current="page"
								className="font-medium text-white hover:text-gray-200"
							>
								{product.title}
							</Link>
						</li>
					</ol>
				</nav>

				{/* Image gallery */}
				<div className="mx-auto mt-6 max-w-2xl sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:gap-x-8 lg:px-8">
					<div className="aspect-h-4 aspect-w-3 hidden overflow-hidden rounded-lg lg:block">
						<Image
							src={product.images?.[0]?.src || ""}
							alt={product.images?.[0]?.src || ""}
							className="h-full w-full object-cover object-center"
							fill
						/>
					</div>
					<div className="hidden lg:grid lg:grid-cols-1 lg:gap-y-8">
						<div className="aspect-h-2 aspect-w-3 overflow-hidden rounded-lg">
							<Image
								src={product.images?.[1]?.src || ""}
								alt={product.images?.[1]?.src || ""}
								fill
								className="h-full w-full object-cover object-center"
							/>
						</div>
						<div className="aspect-h-2 aspect-w-3 overflow-hidden rounded-lg">
							<Image
								src={product.images?.[2]?.src || ""}
								alt={product.images?.[2]?.src || ""}
								className="h-full w-full object-cover object-center"
								fill
							/>
						</div>
					</div>
					<div className="aspect-h-5 aspect-w-4 sm:overflow-hidden sm:rounded-lg lg:aspect-h-4 lg:aspect-w-3">
						<Image
							src={product.images?.[3]?.src || ""}
							alt={product.images?.[3]?.src || ""}
							className="h-full w-full object-cover object-center"
							fill
						/>
					</div>
				</div>

				{/* Product info */}
				<div
					className="mx-auto max-w-2xl px-4 pb-16 pt-10 sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 
        lg:grid-rows-[auto,auto,1fr] lg:gap-x-8 lg:px-8 lg:pb-24 lg:pt-16"
				>
					<div className="lg:col-span-2 lg:border-r lg:border-gray-200 lg:pr-8">
						<h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
							{product.title}
						</h1>
					</div>

					{/* Options */}
					<div className="mt-4 lg:row-span-3 lg:mt-0">
						<h2 className="sr-only">Product information</h2>
						<p className="text-3xl tracking-tight text-white">
							{options.cost / 100} $
						</p>
						<div className="mt-10">
							<div className="flex flex-col">
								<label
									htmlFor="quantity"
									className="block text-lg font-medium text-gray-700"
								>
									Quantity:
								</label>
								<input
									type="number"
									name="quantity"
									min="1"
									id="quantity"
									value={options.quantity}
									onChange={handleQuantityChange}
									className="mt-2 h-10 w-16 rounded-md border-gray-300 bg-skin-secondary px-2 text-white 
                shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
								/>
							</div>
							{/* Sizes */}
							<div className="mt-10">
								<div className="flex items-center justify-between">
									<h3 className="text-sm font-medium text-white">Size</h3>
									<Link
										href="#"
										className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
									>
										Size guide
									</Link>
								</div>

								<RadioGroup
									value={options.size}
									onChange={handleSizeChange}
									className="mt-4"
								>
									<RadioGroup.Label className="sr-only text-white">
										Choose a size
									</RadioGroup.Label>
									<div className="grid grid-cols-4 gap-4 sm:grid-cols-8 lg:grid-cols-4">
										{product.options
											.find((item) => item.type == "size")
											?.values.map((option) => (
												<RadioGroup.Option
													key={option.id}
													value={option.id}
													// disabled={!size.inStock}
													className={`ml-2 flex h-10 text-white ${options.size == option.id
														? "border-indigo-500"
														: null
														}
                    items-center justify-center overflow-hidden ${product.isClothe ? "w-16" : "w-36"
														} group relative flex cursor-pointer items-center rounded-md border-2 bg-skin-secondary py-3 px-4 
                    text-sm font-medium uppercase duration-150 hover:bg-skin-light-secondary focus:outline-none sm:flex-1 
                    sm:py-6`}
													onClick={() => handleSizeChange(option.id)}
												>
													<p
														className={`text-lg ${product.isClothe ? "whitespace-nowrap" : ""
															}`}
													>
														{option.title}
													</p>
												</RadioGroup.Option>
											))}
									</div>
								</RadioGroup>
							</div>
							<button
								type="submit"
								className={`mt-10 flex w-full items-center justify-center rounded-md border border-transparent ${product.isInCart ? "bg-red-500 hover:bg-red-400 focus:ring-red-300" : "bg-indigo-600 focus:ring-indigo-500 hover:bg-indigo-700"} px-8 py-3 duration-300 text-base font-medium text-white focus:outline-none focus:ring-2 `}
								onClick={handleAddToCart}
							>
								{addToCartLoading ? <ClipLoader size={20} color="white" /> : product.isInCart ? "Remove product from cart" : "Add to cart"}
							</button>
						</div>
					</div>

					<div className="py-10 lg:col-span-2 lg:col-start-1 lg:border-r lg:border-gray-200 lg:pb-16 lg:pr-8 lg:pt-6">
						{/* Description and details */}
						<div>
							<h3 className="sr-only">Description</h3>

							<div className="space-y-6">
								<p
									className="text-base text-white"
									ref={descRef}
								></p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ProductPageContainer;

import type { GetServerSideProps } from "next";
import superjson from "superjson";
import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import { getServerAuthSession } from "../../server/auth";
import { appRouter } from "../../server/api/root.router";
import { createContextInner } from "../../server/api/trpc";
import Link from "next/link";

export const getServerSideProps: GetServerSideProps = async (context) => {
	const session = await getServerAuthSession({
		req: context.req,
		res: context.res,
	});
	const ssg = createProxySSGHelpers({
		router: appRouter,
		ctx: await createContextInner({ session }),
		transformer: superjson,
	});

	const productId = context?.params?.productId as string;
	await ssg.printify.getPrintifyProduct.prefetch({ id: productId });
	return {
		props: {
			trpcState: ssg.dehydrate(),
			productId,
		},
	};
};
