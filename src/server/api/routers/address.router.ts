import { Status } from "@prisma/client";
import { z } from "zod";
import { prisma } from "../../db";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

export const addressRouter = createTRPCRouter({
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
