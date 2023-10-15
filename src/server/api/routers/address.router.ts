import { Status } from "@prisma/client";
import { z } from "zod";
import { prisma } from "../../db";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { addressToSchema } from "@/utils/types/zodTypes";

export const addressRouter = createTRPCRouter({
  addShippingAddress: protectedProcedure
    .input(addressToSchema)
    .mutation(async ({ input, ctx: { session } }) => {
      try {
        await prisma.userAddress.update({
          where: {
            selectedAddress: { userId: session.user.id, selected: true },
          },
          data: { selected: false },
        });
      } catch (e) {}
      await prisma.userAddress.create({
        data: {
          ...input,
          userId: session.user.id,
          selected: true,
        },
      });
    }),
  removeAddress: protectedProcedure
    .input(z.object({ addressId: z.string() }))
    .mutation(async ({ input: { addressId }, ctx: { session } }) => {
      await prisma.userAddress.delete({
        where: { id: addressId },
      });
    }),
  editAddress: protectedProcedure
    .input(addressToSchema.and(z.object({ addressId: z.string() })))
    .mutation(async ({ input: { addressId, ...fields }, ctx: { session } }) => {
      await prisma.userAddress.update({
        where: { id: addressId },
        data: fields,
      });
    }),
  selectAddress: protectedProcedure
    .input(
      z.object({
        addressId: z.string(),
      })
    )
    .mutation(async ({ input: { addressId }, ctx: { session } }) => {
      await prisma.userAddress.update({
        where: { id: addressId },
        data: { selected: true },
      });
    }),
  getUserAddress: protectedProcedure.query(async ({ ctx: { session } }) => {
    const addresses = await prisma.userAddress.findMany({
      where: { userId: session.user.id },
    });
    return addresses;
  }),
});
