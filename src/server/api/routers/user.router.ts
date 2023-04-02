import { z } from "zod";
import { personalDetailsSchema } from "../../../utils/printify/printifyTypes";
import { prisma } from "../../db";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import { User } from "@prisma/client";

export const userRouter = createTRPCRouter({
  me: protectedProcedure.query(async ({ ctx: { session } }) => {
    return (await prisma.user.findFirst({
      where: { id: session.user.id },
    })) as User;
  }),
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

  deletePersonalDetails: protectedProcedure
    .input(z.object({ addressId: z.string() }))
    .mutation(async ({ ctx: { session }, input: { addressId } }) => {
      await prisma.userAddress.delete({
        where: { id: addressId },
      });
    }),
  getUserDetails: protectedProcedure.query(async ({ ctx: { session } }) => {
    const addresses = await prisma.userAddress.findMany({
      where: { userId: session.user.id },
    });
    return addresses;
  }),
});
