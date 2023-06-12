import { Prisma } from "@prisma/client";
import { PrismaClientValidationError } from "@prisma/client/runtime";
import { TRPCClientError } from "@trpc/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { prisma } from "../../db";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const cartRouter = createTRPCRouter({
	getCart: protectedProcedure.query(async ({ ctx: { session } }) => {
		const products = await prisma.userCartProducts.findMany({
			where: { userId: session.user.id },
			include: {
				product: true,
			},
		});
		return products;
	}),
	removeProductFromCart: protectedProcedure
		.input(
			z.object({
				productId: z.string().min(1),
			})
		)
		.mutation(async ({ input: { productId }, ctx: { session } }) => {
			await prisma.userCartProducts.delete({
				where: { userId_productId: { productId, userId: session.user.id } },
			});
		}),
	addProductToCart: protectedProcedure
		.input(
			z.object({
				productId: z.string().min(1),
				title: z.string(),
				picture: z.string(),
				description: z.string(),
				variantId: z.number(),
				quantity: z.number(),
				size: z.string(),
				price: z.number(),
			})
		)
		.mutation(
			async ({
				input: {
					productId,
					picture,
					title,
					description,
					quantity,
					size,
					variantId,
					price,
				},
				ctx: { session },
			}) => {
				try {
					await prisma.userCartProducts.create({
						data: {
							product: {
								connectOrCreate: {
									where: { id: productId },
									create: {
										id: productId,
										title,
										picture,
										description,
									},
								},
							},
							variantId,
							quantity,
							price,
							user: { connect: { id: session.user.id } },
							size,
						},
					});
				} catch (error) {
					if (error instanceof Prisma.PrismaClientKnownRequestError) {
						if (error.code === "P2002") {
							throw new TRPCError({ code: "CONFLICT", message: "This product is already added to your cart" })
						}
					}
				}
			}
		),
});
