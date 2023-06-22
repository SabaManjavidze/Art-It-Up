import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import type { PrintifyGetProductResponse } from "../../../utils/printify/printifyTypes";
import {
	addressToSchema,
	createOrderItemSchema,
	lineItemsZodType,
} from "../../../utils/printify/printifyTypes";
import { prisma } from "../../db";
import { Printify } from "../../PrintifyClient";
import { TRPCError } from "@trpc/server";

export const printify = new Printify({
	apiKey: process.env.PRINTIFY_ACCESS_TOKEN as string,
	shopId: process.env.PRINTIFY_SHOP_ID,
});

const userSchema = z.object({
	firstName: z.string(),
	lastName: z.string(),
	phone: z.number(),
})

export const printifyRouter = createTRPCRouter({
	searchProducts: protectedProcedure
		.input(
			z.object({
				name: z.string(),
				tags: z.array(z.string()).nullish(),
			})
		)
		.query(async ({ input: { name, tags }, ctx: { session } }) => {
			const products = await prisma.product.findMany({
				where: {
					title: { contains: name },
					tags:
						tags && tags.length > 0
							? { some: { tag: { name: { in: tags } } } }
							: undefined,
				},
			});
			return products;
		}),
	createPrintifyOrder: protectedProcedure
		.input(createOrderItemSchema)
		.mutation(async ({ input, ctx: { session } }) => {
			const user = await prisma.user.findFirst({
				where: { id: session.user.id },
				select: {
					address: { where: { id: input.addressId, selected: true } },
					firstName: true,
					lastName: true,
					phone: true,
				},
			});
			console.log("user found")

			if (!user) throw new TRPCError({ code: "BAD_REQUEST" });

			try {
				await userSchema.parseAsync(user)
				console.log("checked out personal details")
			} catch (e) {
				console.log({ ERROR: e })
			}

			const address = user?.address[0];
			if (!address)
				throw new TRPCError({
					code: "FORBIDDEN",
					cause: {
						message: "user has not added personal details",
						description:
							"You can add your personal details your the profile page",
					},
				});
			console.log("address is selected")
			const { id: orderId } = await prisma.order.create({
				data: {
					addressId: input.addressId,
					creatorId: session.user.id,
					entityId: input.entityId,
					totalPrice: input.totalPrice,
					totalShipping: input.totalShipping,
				},
			});
			const formatedLineItems = input.line_items.map(item => { return { productId: item.product_id, variantId: item.variant_id, quantity: item.quantity } })
			await prisma.lineItems.createMany({
				data: formatedLineItems.map(item => {
					return {
						orderId,
						...item,
						cost: 0,
						shippingCost: 0
					}
				}),
			});
			const createOrderObj = {
				address_to: {
					email: session.user.email as string,
					phone: user?.phone?.toString() as string,
					first_name: user.firstName as string,
					last_name: user.lastName as string,
					address1: address.address1,
					address2: address.address2.toString(),
					zip: address.zip,
					city: address.city,
					region: address.region as "",
					country: address.country,
				},
				line_items: input.line_items as [(typeof input.line_items)[number]],
				send_shipping_notification: false,
				shipping_method: 1,
				external_id: input?.entityId ?? "",
			}
			await printify.createOrder(createOrderObj);
		}),
	calculateOrderShipping: protectedProcedure
		.input(
			z.object({
				address_to: addressToSchema.omit({ title: true }),
				line_items: lineItemsZodType,
			})
		)
		.mutation(
			async ({ input: { address_to, line_items }, ctx: { session } }) => {
				const user = await prisma.user.findFirst({
					where: { id: session.user.id },
				});

				if (!user) throw new TRPCError({ code: "BAD_REQUEST" });

				return await printify.calculateShipping(address_to, line_items, {
					email: user.email as string,
					first_name: user.firstName as string,
					last_name: user.lastName as string,
					phone: user.phone?.toString() as string,
				});
			}
		),
	getPrintifyProduct: publicProcedure
		.input(z.object({ id: z.string().min(1) }))
		.query(async ({ input: { id }, ctx: { session } }) => {
			const product = await printify.getProduct(id) as unknown as PrintifyGetProductResponse;
			const HomeNLivingTag = "Home & Living";
			const isClothingType = product.tags.find((item) => item == HomeNLivingTag) === undefined;
			if (!product) throw new TRPCError({ code: "NOT_FOUND" })
			let isInCart = false
			if (session?.user) {
				const record = await prisma.userCartProducts.findFirst({ where: { userId: session.user.id, productId: id } })
				if (record) {
					isInCart = true
				}
			}
			return Object.assign(product, { isClothe: isClothingType, isInCart })
		}),
	getPrintifyProductSizes: publicProcedure
		.input(z.object({ id: z.string() }))
		.mutation(async ({ input: { id } }) => {
			const product = await printify.getProduct(id) as unknown as PrintifyGetProductResponse;
			if (!product) throw new TRPCError({ code: "NOT_FOUND" })
			const sizes = product.options.find(item => item.name == "Sizes")?.values
			if (!sizes) return []
			return sizes.map(item => { return { id: item.id, title: item.title } })
		}),
	getPrintifyShopProducts: publicProcedure.query(async () => {
		const products = await printify.getProducts();
		return products;
	}),
});
