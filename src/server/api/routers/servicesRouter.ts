import { z } from "zod";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import { v2 as cloudinary } from "cloudinary";
import axios from "axios";
import { PrintifyGetShopProductsResponse } from "../../../utils/printify/printifyTypes";

export const servicesRouter = createTRPCRouter({
  uploadImage: protectedProcedure
    .input(z.object({ picture: z.string() }))
    .mutation(async ({ input, ctx: { session } }) => {
      const result = await cloudinary.uploader.upload(input.picture, {
        filename_override: session?.user.name as string,
      });
      if (!result) return;
      return result;
    }),
});
