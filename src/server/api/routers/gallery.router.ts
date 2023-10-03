import { z } from "zod";
import { prisma } from "../../db";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import type { UploadApiResponse} from "cloudinary";
import { v2 } from "cloudinary";
import { MAX_IMAGE_COUNT } from "../../../utils/constants";

export const galleryRouter = createTRPCRouter({
	getStyle: protectedProcedure
		.input(z.object({ styleId: z.string() }))
		.query(async ({ input: { styleId }, ctx: { session } }) => {
			return await prisma.userImage.findFirst({
				where: {
					id: styleId,
					ownerId: session.user.id,
				},
			});
		}),
	getUserGallery: protectedProcedure.input(z.object({ userId: z.string()}).optional()).query(async ({input,ctx:{session}}) => {
		if (input?.userId) {
			return await prisma.userImage.findMany({
				where: {
					ownerId: input.userId
				}
			});
		}
		return await prisma.userImage.findMany({
			where: {
				ownerId: session.user.id,
			},
		});
	}),
	uploadStyle: protectedProcedure
		.input(z.object({ picture: z.string() }))
		.mutation(async ({ input: { picture }, ctx: { session } }) => {
			const result: UploadApiResponse = await v2.uploader.upload(picture, {
				filename_override: session?.user.name as string,
				image_metadata: true,
			});
			const arr=await prisma.userImage.findMany({where:{
			ownerId:session.user.id,id:result.public_id
		},
			select:{ownerId:true}
		})
		if(arr.length>=MAX_IMAGE_COUNT)return
			await prisma.userImage.create({
				data: {
					id: result.public_id,
					ownerId: session.user.id,
					url: result.url,
				},
			include:{_count:true}
			});
		}),
	deleteStyle: protectedProcedure
		.input(
			z.object({
				styleId: z.string(),
			})
		)
		.mutation(async ({ input: { styleId } }) => {
			const image = await prisma.userImage.findFirst({
				where: { id: styleId },
			});

			if (!image)
				throw new TRPCError({ code: "BAD_REQUEST", message: "invalid id" });
			await v2.uploader.destroy(image.id);

			await prisma.userImage.delete({
				where: { id: styleId },
			});
		}),
});
