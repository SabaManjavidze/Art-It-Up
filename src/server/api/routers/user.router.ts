import { z } from "zod";
import { personalDetailsSchema } from "../../../utils/printify/printifyTypes";
import { prisma } from "../../db";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

export const userRouter = createTRPCRouter({
  addPersonalDetails: protectedProcedure
    .input(personalDetailsSchema)
    .mutation(async ({ input, ctx: { session } }) => {
      await prisma.userAddress.create({
        data: {
          ...input.address,
          zip: parseInt(input.address.zip),
          userId: session.user.id,
        },
      });
      await prisma.user.update({
        data: { phone: parseInt(input.phone) },
        where: { id: session.user.id },
      });
    }),
  updatePersonalDetails: protectedProcedure
    .input(personalDetailsSchema.and(z.object({ id: z.string() })))
    .mutation(async ({ input, ctx: { session } }) => {
      await prisma.userAddress.update({
        where: { id: input.id },
        data: {
          ...input.address,
          zip: parseInt(input.address.zip),
          userId: session.user.id,
        },
      });
      await prisma.user.update({
        data: { phone: parseInt(input.phone) },
        where: { id: session.user.id },
      });
    }),

  deletePersonalDetails: protectedProcedure.mutation(
    async ({ ctx: { session } }) => {
      await prisma.userAddress.delete({
        where: { userId: session.user.id },
      });
    }
  ),
  getUserDetails: protectedProcedure.query(async ({ ctx: { session } }) => {
    const addresses = await prisma.userAddress.findMany({
      where: { userId: session.user.id },
    });
    return addresses;
  }),
});
