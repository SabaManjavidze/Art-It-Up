import { z } from "zod";
import { prisma } from "../../db";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

export const entityRouter = createTRPCRouter({
  getEntity: protectedProcedure
    .input(z.object({ entityId: z.string() }))
    .query(async ({ input: { entityId }, ctx: { session } }) => {
      return await prisma.entity.findFirst({
        where: {
          id: entityId,
        },
        include: { gallery: true },
      });
    }),
  getEntities: protectedProcedure
    .input(z.object({ userId: z.string().optional() }))
    .query(async ({ input: { userId }, ctx: { session } }) => {
      return await prisma.entity.findMany({
        where: {
          creatorId: userId ?? session.user.id,
        },
      });
    }),
  createEntity: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        picture: z.string().optional(),
      })
    )
    .mutation(async ({ input: { name, picture }, ctx: { session } }) => {
      const entities = await prisma.entity.findMany({
        where: { creatorId: session.user.id },
      });
      if (entities.length >= 5)
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "cannot create more than 5 entities",
        });
      return await prisma.entity.create({
        data: {
          name,
          picture,
          creatorId: session.user.id,
        },
      });
    }),
});
