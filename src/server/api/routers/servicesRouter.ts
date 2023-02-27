import { z, ZodArray } from "zod";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import { UploadApiResponse, v2 as cloudinary } from "cloudinary";
import axios from "axios";
import { PrintifyGetShopProductsResponse } from "../../../utils/printify/printifyTypes";
import { prisma } from "../../db";
import { Prisma } from "@prisma/client";

export const servicesRouter = createTRPCRouter({
  getUserImages: protectedProcedure.query(async ({ ctx: { session } }) => {
    const images = await prisma.userImage.findMany({
      where: { userId: session.user.id },
    });
    return images;
  }),
  uploadImage: protectedProcedure
    .input(z.object({ picture: z.string() }))
    .mutation(async ({ input: { picture }, ctx: { session } }) => {
      const result: UploadApiResponse = await cloudinary.uploader.upload(
        picture,
        {
          filename_override: session?.user.name as string,
          image_metadata: true,
        }
      );
      await prisma.userImage.create({
        data: { userId: session.user.id, url: result.url },
      });
    }),
});
