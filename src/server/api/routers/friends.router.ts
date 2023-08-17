import { Status } from "@prisma/client";
import { z } from "zod";
import { prisma } from "../../db";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

export const friendsRouter = createTRPCRouter({
  removeFriend: protectedProcedure
    .input(
      z.object({
        friendId: z.string().cuid(),
        userId: z.string().cuid(),
      })
    )
    .mutation(async ({ input: { friendId, userId }, ctx: { session } }) => {
      await prisma.friends.delete({
        where: {
          userId_friendId: {
            friendId,
            userId,
          },
        },
      });
    }),
  acceptFriendRequest: protectedProcedure
    .input(
      z.object({
        requestId: z.string(),
        status: z.enum(["ACCEPTED", "REJECTED"]),
      })
    )
    .mutation(async ({ input: { requestId, status }, ctx: { session } }) => {
      if (status == Status.REJECTED) {
        await prisma.friends.delete({ where: { id: requestId } });
        return;
      }
      await prisma.friends.update({
        where: { id: requestId },
        data: { status: status },
      });
    }),
  getSentRequests: protectedProcedure.query(async ({ ctx: { session } }) => {
    const requests = await prisma.friends.findMany({
      where: { userId: session.user.id, status: Status.PENDING },
      include: { friend: { select: { name: true, image: true, id: true } } },
    });
    return requests;
  }),
  getRecievedRequests: protectedProcedure.query(
    async ({ input, ctx: { session } }) => {
      const requests = await prisma.friends.findMany({
        where: { friendId: session.user.id, status: Status.PENDING },
        include: { user: { select: { name: true, image: true, id: true } } },
      });
      return requests;
    }
  ),
  getFriends: protectedProcedure.query(async ({ ctx: { session } }) => {
    const friends = await prisma.friends.findMany({
      where: {
        OR: [{ friendId: session.user.id }, { userId: session.user.id }],
        status: Status.ACCEPTED,
      },
      include: {
        friend: { select: { name: true, image: true, id: true } },
        user: { select: { name: true, image: true, id: true } },
      },
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
          AND: { userId: session.user.id, friendId: addressantId },
        },
      });
      if (friendShipRecord) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: friendShipRecord.status
            ? `You are already friends with ${addressant?.name}`
            : "The friend request has already been sent",
        });
      }
      await prisma.friends.create({
        data: {
          userId: session.user.id,
          friendId: addressantId,
        },
      });
    }),
});
