import { z } from "zod";
import { prisma } from "../../db";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { increaseCredits } from "../utils/credits";

export const creditRouter = createTRPCRouter({
  buyCredits: protectedProcedure
    .input(
      z.object({
        amount: z.number(),
      })
    )
    .mutation(async ({ input: { amount }, ctx: { session } }) => {
      await increaseCredits(session.user.id, amount);
    }),
});
