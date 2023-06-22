import { z } from "zod";
import { prisma } from "../../db";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { v2 } from "cloudinary";
import { MAX_ENTITY_COUNT } from "../../../utils/constants";

export const entityRouter = createTRPCRouter({
	getEntity: protectedProcedure
		.input(z.object({ entityId: z.string().cuid() }))
		.query(async ({ input: { entityId }, ctx: { session } }) => {
			return await prisma.entity.findFirst({
				where: {
					id: entityId,
				},
				include: { gallery: true },
			});
		}),
	getEntities: protectedProcedure
		.input(z.object({ userId: z.string().cuid().optional() }))
		.query(async ({ input: { userId }, ctx: { session } }) => {
			return await prisma.entity.findMany({
				where: {
					creatorId: userId ?? session.user.id,
				},
			});
		}),
	deleteEntity: protectedProcedure
		.input(
			z.object({
				entityId: z.string().cuid(),
			})
		)
		.mutation(async ({ input: { entityId } }) => {
			const images = await prisma.userImage.findMany({ where: { entityId } })
			images.forEach(image => {
				v2.uploader.destroy(image.id)
			})

			await prisma.entity.delete({
				where: { id: entityId },
			});

		}),
	createEntity: protectedProcedure
		.input(
			z.object({
				name: z.string(),
				picture: z.string().optional(),
			})
		)
		.mutation(async ({ input: { name, picture }, ctx: { session } }) => {
			const entities = await prisma.entity.findMany({
				where: { creatorId: session.user.id },
			});
			if (entities.length >= MAX_ENTITY_COUNT)
				throw new TRPCError({
					code: "FORBIDDEN",
					message: "cannot create more than 5 entities",
				});
			return await prisma.entity.create({
				data: {
					name,
					picture,
					creatorId: session.user.id,
				},
			});
		}),
});
