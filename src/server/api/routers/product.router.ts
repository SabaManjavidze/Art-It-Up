import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import type { PrintifyGetProductResponse } from "../../../utils/printify/printifyTypes";

import { prisma } from "../../db";
import { TRPCError } from "@trpc/server";
import { printify } from "../../PrintifyClient";

export const productRouter = createTRPCRouter({
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

	getPrintifyProduct: publicProcedure
		.input(z.object({ id: z.string().min(1) }))
		.query(async ({ input: { id }, ctx: { session } }) => {
			const product = (await printify.getProduct(
				id
			)) as unknown as PrintifyGetProductResponse;
			const HomeNLivingTag = "Home & Living";
			const isClothingType =
				product.tags.find((item) => item == HomeNLivingTag) === undefined;
			if (!product) throw new TRPCError({ code: "NOT_FOUND" });
			let isInCart = false;
			if (session?.user) {
				const record = await prisma.userCartProducts.findFirst({
					where: { userId: session.user.id, productId: id },
				});
				if (record) {
					isInCart = true;
				}
			}
			return Object.assign(product, { isClothe: isClothingType, isInCart });
		}),
	getPrintifyProductSizes: publicProcedure
		.input(z.object({ id: z.string() }))
		.mutation(async ({ input: { id } }) => {
			const product = (await printify.getProduct(
				id
			)) as unknown as PrintifyGetProductResponse;
			if (!product) throw new TRPCError({ code: "NOT_FOUND" });
			const sizes = product.options.find(
				(item) => item.type == "size"
			)?.values;
			if (!sizes) return [];
			let factor = 0
			const HomeNLivingTag = "Home & Living";
			const isClothingType =
				product.tags.find((item) => item == HomeNLivingTag) === undefined;
			if (isClothingType) {
				factor = product.options.find(
					(item) => item.type == "color"
				)?.values[0]?.id as number;
			} else {
				factor = product.options.find(
					(item) => item.type == "depth"
				)?.values[0]?.id as number;
			}
			return sizes.map((item) => {
				const variant = product.variants.find(item2 => {
					return item2.options.includes(factor) && item2.options.includes(item.id)
				})
				return { id: item.id, title: item.title, variantId: variant?.id, cost: variant?.cost };
			});
		}),
	getPrintifyShopProducts: publicProcedure.query(async () => {
		const products = await printify.getProducts();
		return products;
	}),
});
