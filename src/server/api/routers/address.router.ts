import { Status } from "@prisma/client";
import { z } from "zod";
import { prisma } from "../../db";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { addressToSchema } from "@/utils/printify/printifyTypes";

export const addressRouter = createTRPCRouter({
  removeAddress: protectedProcedure
    .input(z.object({ addressId: z.string().cuid() }))
    .mutation(async ({ input: { addressId }, ctx: { session } }) => {
      await prisma.userAddress.delete({
        where: { id: addressId },
      });
    }),
  editAddress: protectedProcedure
    .input(addressToSchema.and(z.object({ addressId: z.string().cuid() })))
    .mutation(async ({ input: { addressId, ...fields }, ctx: { session } }) => {
      await prisma.userAddress.update({
        where: { id: addressId },
        data: fields,
      });
    }),
  selectAddress: protectedProcedure
    .input(
      z.object({
        addressId: z.string().cuid(),
      })
    )
    .mutation(async ({ input: { addressId }, ctx: { session } }) => {
      await prisma.userAddress.update({
        where: { id: addressId },
        data: { selected: true },
      });
    }),
});
