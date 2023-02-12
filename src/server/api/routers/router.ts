import { z } from "zod";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import { v2 as cloudinary } from "cloudinary";

export const servicesRouter = createTRPCRouter({
  uploadImage: publicProcedure
    // .use(isAuthed)
    .input(z.object({ picture: z.string() }))
    .mutation(async ({ input }) => {
      const result = await cloudinary.uploader.upload(input.picture);
      if (!result) return;
      return result;
    }),
});
