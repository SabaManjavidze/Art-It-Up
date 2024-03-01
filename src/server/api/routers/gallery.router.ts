import { z } from "zod";
import { prisma } from "../../db";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import type { UploadApiResponse } from "cloudinary";
import { v2 } from "cloudinary";
import { MAX_IMAGE_COUNT } from "@/utils/general/constants";
import { printify } from "@/server/PrintifyClient";

export const galleryRouter = createTRPCRouter({
  // uploadImagePrintify: protectedProcedure
  //   .input(z.object({ url: z.string(), file_name: z.string() }))
  //   .query(async ({ input: { url, file_name }, ctx: { session } }) => {
  //     return await printify.uploadImage({
  //       url,
  //       file_name,
  //     });
  //   }),
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
  getUserGallery: protectedProcedure
    .input(
      z.object({
        userId: z.string().optional(),

        limit: z.number().min(1).max(20).optional().default(12),
        cursor: z.string().nullish(),
        skip: z.number().optional(),
      })
    )
    .query(async ({ input, ctx: { session } }) => {
      const { skip, cursor, limit } = input;
      const items = await prisma.userImage.findMany({
        take: limit + 1,
        skip,
        cursor: cursor ? { id: cursor } : undefined,
        where: {
          ownerId: input?.userId ? input.userId : session.user.id,
        },
      });

      let nextCursor: typeof cursor | undefined;
      if (items.length > limit) {
        const nextItem = items.pop();
        nextCursor = nextItem?.id;
      }
      return { imgs: items, nextCursor };
    }),
  uploadStyle: protectedProcedure
    .input(z.object({ picture: z.string() }))
    .mutation(async ({ input: { picture }, ctx: { session } }) => {
      const result: UploadApiResponse = await v2.uploader.upload(picture, {
        filename_override: session?.user.name as string,
        image_metadata: true,
      });
      const arr = await prisma.userImage.findMany({
        where: {
          ownerId: session.user.id,
          id: result.public_id,
        },
        select: { ownerId: true },
      });
      if (arr.length >= MAX_IMAGE_COUNT) return;
      const img = await prisma.userImage.create({
        data: {
          id: result.public_id,
          ownerId: session.user.id,
          url: result.url,
        },
      });
      return img.id;
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
