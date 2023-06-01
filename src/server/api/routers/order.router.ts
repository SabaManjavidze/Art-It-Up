import { z } from "zod";
import { prisma } from "../../db";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

export const orderRouter = createTRPCRouter({
	getMyOrders: protectedProcedure.query(async ({ ctx: { session } }) => {
		const orders = await prisma.order.findMany({
			where: { creatorId: session.user.id },
			include: { line_items: { include: { product: true } } }
		});
		return orders;
	}),
});
