import { z } from "zod";
import { prisma } from "../../db";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

export const friendsRouter = createTRPCRouter({
  acceptFriendRequest: protectedProcedure
    .input(z.object({ requestId: z.string() }))
    .mutation(async ({ input: { requestId }, ctx: { session } }) => {
      await prisma.friends.update({
        where: { id: requestId },
        data: { status: true },
      });
    }),
  getSentRequests: protectedProcedure.query(async ({ ctx: { session } }) => {
    const requests = await prisma.friends.findMany({
      where: { user_id: session.user.id, status: false },
      include: { friend: { select: { name: true, image: true, id: true } } },
    });
    return requests;
  }),
  getRecievedRequests: protectedProcedure.query(
    async ({ input, ctx: { session } }) => {
      const requests = await prisma.friends.findMany({
        where: { friend_id: session.user.id, status: false },
        include: { user: { select: { name: true, image: true, id: true } } },
      });
      return requests;
    }
  ),
  getFriends: protectedProcedure.query(async ({ ctx: { session } }) => {
    const friends = await prisma.friends.findMany({
      where: {
        OR: [{ friend_id: session.user.id }, { user_id: session.user.id }],
        status: true,
      },
      include: { friend: { select: { name: true, image: true, id: true } } },
    });
    return friends;
  }),
  sendFriendRequest: protectedProcedure
    .input(
      z.object({
        addressantId: z.string(),
      })
    )
    .mutation(async ({ input: { addressantId }, ctx: { session } }) => {
      const addressant = await prisma.user.findFirst({
        where: { id: addressantId },
      });
      const friendShipRecord = await prisma.friends.findFirst({
        where: {
          AND: { user_id: session.user.id, friend_id: addressantId },
        },
      });
      if (friendShipRecord) {
        throw new Error(
          friendShipRecord.status
            ? `You are already friends with ${addressant?.name}`
            : "The friend request has already been sent"
        );
      }
      await prisma.friends.create({
        data: {
          user_id: session.user.id,
          friend_id: addressantId,
        },
      });
    }),
});
