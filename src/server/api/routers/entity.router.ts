import { z } from "zod";
import { prisma } from "../../db";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

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
  getEntities: protectedProcedure.query(async ({ ctx: { session } }) => {
    return await prisma.entity.findMany({
      where: {
        creatorId: session.user.id,
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
      return await prisma.entity.create({
        data: {
          name,
          picture,
          creatorId: session.user.id,
        },
      });
    }),
});
